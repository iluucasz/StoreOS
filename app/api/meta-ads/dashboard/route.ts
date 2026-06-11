import { NextResponse } from "next/server"
import {
  isConfigured,
  graph,
  accountId,
  timeRange,
  findAction,
  num,
  ddmm,
  translatePlatform,
  PURCHASE,
  MetaError,
} from "@/lib/meta-ads"

function pct(curr: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

/** Visão geral da conta: métricas, série diária e split por plataforma (FB/IG). */
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ configured: false })

  const acc = accountId()
  try {
    const [curr, prev, daily, platforms] = await Promise.all([
      graph(`${acc}/insights`, { fields: "spend,impressions,reach,clicks,ctr,cpc,actions,action_values", time_range: timeRange(7, 0) }),
      graph(`${acc}/insights`, { fields: "spend,actions,action_values", time_range: timeRange(7, 7) }),
      graph(`${acc}/insights`, { fields: "spend,impressions,clicks,actions", time_increment: "1", time_range: timeRange(14, 0) }),
      graph(`${acc}/insights`, { fields: "spend,impressions,clicks,actions", breakdowns: "publisher_platform", time_range: timeRange(7, 0) }),
    ])

    const c = curr.data?.[0] ?? {}
    const p = prev.data?.[0] ?? {}

    const spend = num(c.spend)
    const purchases = findAction(c.actions, PURCHASE)
    const revenue = findAction(c.action_values, PURCHASE)
    const roas = spend ? revenue / spend : 0
    const cpa = purchases ? spend / purchases : 0

    const pSpend = num(p.spend)
    const pPurchases = findAction(p.actions, PURCHASE)
    const pRevenue = findAction(p.action_values, PURCHASE)
    const pRoas = pSpend ? pRevenue / pSpend : 0
    const pCpa = pPurchases ? pSpend / pPurchases : 0

    return NextResponse.json({
      configured: true,
      totals: {
        spend,
        purchases,
        revenue,
        roas,
        cpa,
        ctr: num(c.ctr),
        cpc: num(c.cpc),
        impressions: num(c.impressions),
        reach: num(c.reach),
        clicks: num(c.clicks),
        spendDelta: pct(spend, pSpend),
        purchasesDelta: pct(purchases, pPurchases),
        roasDelta: pct(roas, pRoas),
        cpaDelta: pct(cpa, pCpa),
      },
      series: (daily.data ?? []).map((r: any) => ({
        date: ddmm(r.date_start),
        spend: Math.round(num(r.spend) * 100) / 100,
        clicks: num(r.clicks),
        purchases: findAction(r.actions, PURCHASE),
      })),
      platforms: (platforms.data ?? []).map((r: any) => ({
        name: translatePlatform(r.publisher_platform),
        spend: Math.round(num(r.spend) * 100) / 100,
        clicks: num(r.clicks),
        purchases: findAction(r.actions, PURCHASE),
      })),
    })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao buscar dados da Meta"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
