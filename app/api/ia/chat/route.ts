import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { initSchema, saveMessage, getHistory } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

const SHOP = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!
const BASE = `https://${SHOP}/admin/api/2025-01`

async function fetchStoreContext() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${BASE}/orders.json?status=any&limit=50&fields=id,name,created_at,total_price,financial_status,fulfillment_status,customer,line_items`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      }),
      fetch(`${BASE}/products.json?limit=50&fields=id,title,status,variants`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      }),
    ])

    const [{ orders = [] }, { products = [] }] = await Promise.all([
      ordersRes.json(),
      productsRes.json(),
    ])

    const paid = orders.filter((o: { financial_status: string }) => o.financial_status === "paid")
    const pending = orders.filter((o: { financial_status: string }) => o.financial_status === "pending")
    const cancelled = orders.filter((o: { financial_status: string }) =>
      ["refunded", "voided"].includes(o.financial_status)
    )
    const totalRevenue = paid.reduce((s: number, o: { total_price: string }) => s + parseFloat(o.total_price), 0)
    const avgTicket = paid.length > 0 ? totalRevenue / paid.length : 0

    const activeProducts = products.filter((p: { status: string }) => p.status === "active")
    const productLines = activeProducts.slice(0, 15).map((p: {
      title: string
      variants: { price: string; inventory_quantity: number }[]
    }) => {
      const stock = p.variants.reduce((s: number, v: { inventory_quantity: number }) => s + (v.inventory_quantity ?? 0), 0)
      const price = parseFloat(p.variants[0]?.price ?? "0")
      return `- ${p.title}: R$ ${price.toFixed(2)}, estoque ${stock} unid.`
    }).join("\n")

    const today = new Date().toDateString()
    const todayOrders = orders.filter((o: { created_at: string }) =>
      new Date(o.created_at).toDateString() === today
    )

    return `
DADOS REAIS DA LOJA (${SHOP}):
Data atual: ${new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

PEDIDOS:
- Total (últimos 50): ${orders.length} pedidos
- Pagos: ${paid.length} | Pendentes: ${pending.length} | Cancelados: ${cancelled.length}
- Receita total (pagos): R$ ${totalRevenue.toFixed(2)}
- Ticket médio: R$ ${avgTicket.toFixed(2)}
- Pedidos hoje: ${todayOrders.length}

PRODUTOS (${activeProducts.length} ativos de ${products.length} total):
${productLines || "Nenhum produto ativo"}
`.trim()
  } catch {
    return "Dados da loja temporariamente indisponíveis."
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json({ error: "message e sessionId são obrigatórios" }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    await initSchema()

    const [history, storeContext] = await Promise.all([
      getHistory(sessionId, 10),
      fetchStoreContext(),
    ])

    await saveMessage(sessionId, user.id, "user", message)

    const systemPrompt = `Você é a IA do StoreOS, assistente de análise de negócios para e-commerce de moda.
Você tem acesso aos dados reais da loja e deve analisá-los para dar insights práticos e acionáveis.

${storeContext}

INSTRUÇÕES:
- Responda sempre em português brasileiro, de forma direta e objetiva
- Use os dados reais fornecidos acima para embasar suas respostas
- Quando identificar problemas, dê sugestões concretas de ação
- Use números reais dos dados quando disponíveis
- Seja conciso mas completo — máximo 3-4 parágrafos por resposta
- Foque no que o lojista pode fazer AGORA para melhorar resultados`

    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: message },
    ]

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    })

    const encoder = new TextEncoder()
    let fullResponse = ""

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ""
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }
          await saveMessage(sessionId, user.id, "assistant", fullResponse)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("IA chat error:", error)
    return NextResponse.json({ error: "Erro ao processar mensagem" }, { status: 500 })
  }
}
