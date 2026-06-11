import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { getCurrentUser } from "@/lib/auth"
import { getHistory, initSchema } from "@/lib/db"
import { fetchStoreContext } from "@/lib/ia/store-context"

type ChatRole = "user" | "assistant"
type ChatMessage = { role: ChatRole; content: string }

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
const BUSINESS_TERMS = [
  "venda",
  "pedido",
  "faturamento",
  "receita",
  "ticket",
  "estoque",
  "produto",
  "margem",
  "lucro",
  "cliente",
  "conversao",
  "marketing",
  "campanha",
  "custo",
  "desconto",
]

const FALLBACK_SUGGESTIONS = [
  "Como estão as vendas hoje?",
  "Quantos pedidos entraram esta semana?",
  "Qual produto precisa de atenção?",
]

function isBusinessSuggestion(value: string): boolean {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  if (/\b(estilo|ajuda|procura|quer fazer|posso ajudar)\b/.test(normalized)) return false
  return BUSINESS_TERMS.some((term) => normalized.includes(term))
}

function cleanSuggestions(content: string): string[] {
  const source = content.trim()
  const jsonBlock = source.match(/\[[\s\S]*\]/)?.[0] ?? source

  try {
    const parsed = JSON.parse(jsonBlock)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().replace(/\s+/g, " "))
        .filter(isBusinessSuggestion)
        .filter(Boolean)
        .slice(0, 3)
    }
  } catch {
    // Fall through to a conservative line parser.
  }

  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\d.)\s"']+/, "").replace(/["',]+$/, "").trim())
    .filter(isBusinessSuggestion)
    .filter(Boolean)
    .slice(0, 3)
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false
      const message = item as Partial<ChatMessage>
      return (message.role === "user" || message.role === "assistant") && typeof message.content === "string"
    })
    .map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }))
    .slice(-8)
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messages } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId e obrigatorio" }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    await initSchema()

    const visibleMessages = normalizeMessages(messages)
    const [history, storeContext] = await Promise.all([
      visibleMessages.length > 0 ? Promise.resolve(visibleMessages) : getHistory(sessionId, 8),
      fetchStoreContext(),
    ])

    const conversation = history.length > 0
      ? history.map((item) => `${item.role === "user" ? "Cliente" : "OSIA"}: ${item.content}`).join("\n\n")
      : "Ainda nao ha conversa nesta sessao."

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.45,
      max_tokens: 180,
      messages: [
        {
          role: "system",
          content: `Voce gera proximas perguntas para a OSIA em uma tela de chat de analise de e-commerce.
Use os dados reais da loja e o contexto da conversa para sugerir perguntas sobre indicadores do negocio.
Retorne somente um array JSON com 3 strings.
Cada string deve ser uma pergunta curta em portugues brasileiro, com ate 58 caracteres.
As perguntas devem ser sobre vendas, pedidos, faturamento, receita, ticket medio, estoque, produtos, margem, lucro, clientes, conversao, campanhas ou custos.
Exemplos de formato: "Como estão as vendas hoje?", "Quantos pedidos entraram esta semana?", "Qual produto precisa de atenção?"
Nunca gere perguntas genericas como "O que voce procura?", "Qual seu estilo?" ou "Precisa ajuda?".
Nao use markdown, comentarios, numeracao ou texto fora do JSON.`,
        },
        {
          role: "user",
          content: `${storeContext}\n\nCONVERSA:\n${conversation}`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content ?? "[]"
    const suggestions = [...cleanSuggestions(content), ...FALLBACK_SUGGESTIONS]
      .filter((item, index, list) => list.indexOf(item) === index)
      .slice(0, 3)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("IA suggestions error:", error)
    return NextResponse.json({ suggestions: [] }, { status: 200 })
  }
}
