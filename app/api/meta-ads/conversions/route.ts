import { NextResponse } from "next/server"
import {
  isConfigured,
  graph,
  accountId,
  timeRange,
  findAction,
  num,
  PURCHASE,
  ADD_TO_CART,
  CHECKOUT,
  VIEW_CONTENT,
  LEAD,
  MetaError,
} from "@/lib/meta-ads"

const EVENTS: { name: string; types: string[] }[] = [
  { name: "Compras", types: PURCHASE },
  { name: "Checkout iniciado", types: CHECKOUT },
  { name: "Adições ao carrinho", types: ADD_TO_CART },
  { name: "Visualização de conteúdo", types: VIEW_CONTENT },
  { name: "Leads", types: LEAD },
]

/** Conversões (eventos do Pixel) dos últimos 30 dias. */
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ configured: false })

  try {
    const data = await graph(`${accountId()}/insights`, {
      fields: "spend,actions,action_values",
      time_range: timeRange(30, 0),
    })
    const row = data.data?.[0] ?? {}
    const spend = num(row.spend)

    const events = EVENTS.map((e) => {
      const count = findAction(row.actions, e.types)
      const value = findAction(row.action_values, e.types)
      return { name: e.name, count, value, valuePerEvent: count ? value / count : 0 }
    })

    const purchases = findAction(row.actions, PURCHASE)
    const revenue = findAction(row.action_values, PURCHASE)

    return NextResponse.json({
      configured: true,
      totals: {
        spend,
        purchases,
        revenue,
        costPerPurchase: purchases ? spend / purchases : 0,
        roas: spend ? revenue / spend : 0,
      },
      events,
    })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao buscar conversões da Meta"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
