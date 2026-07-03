import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { getCurrentUser } from "@/lib/auth"
import { fetchStoreContext } from "@/lib/ia/store-context"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"

const money = (v: number) => `R$ ${Number(v || 0).toFixed(2)}`

const AUDIENCE = { niche: "Nicho", mid: "Intermediário", mass: "Massa" } as const
const SEASON = { low: "Baixa", normal: "Normal", high: "Alta" } as const
const PROJECTION = { pessimistic: "Pessimista", realistic: "Realista", optimistic: "Otimista" } as const

/** Avalia um cenário do simulador cruzando com os dados reais da loja (OSIA). */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

    const { data, results } = await request.json()
    if (!data || !results) {
      return NextResponse.json({ error: "Dados do cenário ausentes" }, { status: 400 })
    }

    const storeContext = await fetchStoreContext(user.id)

    const scenario = `CENÁRIO SIMULADO PELO LOJISTA ("${data.scenarioName}"):
- Quantidade de produtos: ${data.productQuantity}
- Custo unitário médio: ${money(data.averageUnitCost)}
- Investimento em marketing: ${money(data.marketingBudget)} (${data.marketingPeriod})
- ${data.useCustomSellingPrice ? `Preço de venda definido manualmente: ${money(data.sellingPrice ?? 0)}` : `Margem de lucro desejada: ${data.desiredProfitMargin}%`}
- Público-alvo: ${AUDIENCE[data.targetAudience as keyof typeof AUDIENCE] ?? data.targetAudience}
- Sazonalidade: ${SEASON[data.seasonality as keyof typeof SEASON] ?? data.seasonality}
- Vendas estimadas pelo lojista: ${data.estimatedMonthlySales} unidades/mês
- Tipo de projeção: ${PROJECTION[data.projectionType as keyof typeof PROJECTION] ?? data.projectionType} | Precisão informada: ${data.estimationAccuracy}%

RESULTADO CALCULADO PELO SIMULADOR:
- Preço de venda final: ${money(results.sellingPrice)}
- Lucro por unidade: ${money(results.profitPerUnit)}
- Ponto de equilíbrio: ${results.breakEvenUnits} unidades/mês
- Vendas estimadas (ajustadas): ${results.estimatedSales} unidades/mês
- Receita mensal projetada: ${money(results.monthlyRevenue)}
- Custos mensais: ${money(results.monthlyCosts)}
- Lucro líquido mensal: ${money(results.monthlyProfit)}
- ROI projetado: ${Number(results.roi || 0).toFixed(1)}%
- Margem de lucro final: ${results.monthlyRevenue ? ((results.monthlyProfit / results.monthlyRevenue) * 100).toFixed(1) : "0"}%`

    const systemPrompt = `Seu nome é OSIA, a IA da loja no StoreOS, criada pela StoreOS.
Você está avaliando uma SIMULAÇÃO DE PRECIFICAÇÃO E CENÁRIO feita pelo lojista, para torná-la mais precisa e realista.
Seu trabalho é cruzar as premissas do cenário com os DADOS REAIS da loja abaixo e dar um veredito honesto.

${storeContext}

COMO AVALIAR:
- Compare as VENDAS ESTIMADAS do cenário com o histórico real (pedidos pagos nos últimos 7/30 dias, último pedido). Diga se a estimativa está realista, otimista ou pessimista, citando os números reais.
- Compare o PREÇO de venda e a MARGEM do cenário com o ticket médio real e os produtos reais da loja.
- Avalie o ROI, o ponto de equilíbrio e o lucro: o ponto de equilíbrio é atingível dado o volume real de vendas? Em quanto tempo?
- Aponte de 1 a 3 RISCOS concretos do cenário (ex.: vendas estimadas acima do real, ponto de equilíbrio alto demais, margem apertada, marketing sem retorno comprovado).
- Dê de 2 a 4 AJUSTES práticos e específicos para tornar o cenário mais realista (ex.: "reduza as vendas estimadas para ~X/mês, que é o seu real", "ajuste o preço para Y", "teste tráfego antes de assumir Z vendas").

COMO RESPONDER:
- Português brasileiro, claro e com acentuação correta.
- Use Markdown enxuto, com seções em negrito: **Veredito**, **Comparação com o real**, **Riscos**, **Ajustes recomendados**.
- Seja específica com números reais. Se faltar dado real (ex.: sem vendas no histórico), diga e baseie-se em boas práticas, deixando claro que é hipótese.
- No máximo 4 a 6 parágrafos curtos ou listas. Não invente dados que não estão no contexto.`

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: scenario },
      ],
      temperature: 0.4,
      max_tokens: 900,
    })

    const analysis = completion.choices[0]?.message?.content ?? ""
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("IA simulate error:", error)
    return NextResponse.json({ error: "Erro ao analisar o cenário" }, { status: 500 })
  }
}
