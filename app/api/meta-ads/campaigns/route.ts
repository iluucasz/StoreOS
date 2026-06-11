import { NextResponse } from "next/server"
import { isConfigured, graph, accountId, findAction, num, translateStatus, PURCHASE, MetaError } from "@/lib/meta-ads"

/** Campanhas com insights dos últimos 30 dias. */
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ configured: false })

  try {
    const data = await graph(`${accountId()}/campaigns`, {
      fields:
        "name,status,objective,daily_budget,insights.date_preset(last_30d){spend,impressions,reach,clicks,ctr,actions,action_values}",
      limit: "100",
    })

    const campaigns = (data.data ?? []).map((c: any) => {
      const ins = c.insights?.data?.[0] ?? {}
      const spend = num(ins.spend)
      const purchases = findAction(ins.actions, PURCHASE)
      const revenue = findAction(ins.action_values, PURCHASE)
      return {
        id: c.id,
        name: c.name,
        status: translateStatus(c.status),
        objective: c.objective || "-",
        dailyBudget: c.daily_budget ? num(c.daily_budget) / 100 : 0,
        spend,
        impressions: num(ins.impressions),
        reach: num(ins.reach),
        clicks: num(ins.clicks),
        ctr: num(ins.ctr),
        purchases,
        costPerResult: purchases ? spend / purchases : 0,
        roas: spend ? revenue / spend : 0,
      }
    })

    // ordena por gasto desc
    campaigns.sort((a: any, b: any) => b.spend - a.spend)
    return NextResponse.json({ configured: true, campaigns })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao buscar campanhas da Meta"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
