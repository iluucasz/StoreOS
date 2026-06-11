import { NextResponse } from "next/server"
import { isConfigured, tiktok, advertiserId, num, ttDate, dateRange, TikTokError } from "@/lib/tiktok-ads"

function pct(curr: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

/** Visão geral do anunciante: métricas e série diária (14 dias). */
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ configured: false })

  const cur = dateRange(14, 0)
  const prv = dateRange(14, 14)
  const metrics = ["spend", "impressions", "clicks", "ctr", "conversion", "cost_per_conversion"]

  try {
    const base = {
      advertiser_id: advertiserId(),
      report_type: "BASIC",
      data_level: "AUCTION_ADVERTISER",
      dimensions: ["stat_time_day"],
      page_size: 30,
    }
    const [daily, prev] = await Promise.all([
      tiktok("/report/integrated/get/", { ...base, metrics, start_date: cur.start, end_date: cur.end }),
      tiktok("/report/integrated/get/", { ...base, metrics: ["spend", "conversion"], start_date: prv.start, end_date: prv.end }),
    ])

    const list: any[] = daily.list ?? []
    const series = list
      .map((r) => ({
        date: ttDate(r.dimensions.stat_time_day),
        raw: r.dimensions.stat_time_day,
        spend: Math.round(num(r.metrics.spend) * 100) / 100,
        clicks: num(r.metrics.clicks),
        conversions: num(r.metrics.conversion),
      }))
      .sort((a, b) => a.raw.localeCompare(b.raw))
      .map(({ raw, ...rest }) => rest)

    const sum = (arr: any[], f: (r: any) => number) => arr.reduce((s, r) => s + f(r), 0)
    const spend = sum(list, (r) => num(r.metrics.spend))
    const impressions = sum(list, (r) => num(r.metrics.impressions))
    const clicks = sum(list, (r) => num(r.metrics.clicks))
    const conversions = sum(list, (r) => num(r.metrics.conversion))
    const ctr = impressions ? (clicks / impressions) * 100 : 0
    const cpa = conversions ? spend / conversions : 0

    const pList: any[] = prev.list ?? []
    const pSpend = sum(pList, (r) => num(r.metrics.spend))
    const pConversions = sum(pList, (r) => num(r.metrics.conversion))
    const pCpa = pConversions ? pSpend / pConversions : 0

    return NextResponse.json({
      configured: true,
      totals: {
        spend,
        impressions,
        clicks,
        conversions,
        ctr,
        cpa,
        spendDelta: pct(spend, pSpend),
        conversionsDelta: pct(conversions, pConversions),
        cpaDelta: pct(cpa, pCpa),
      },
      series,
    })
  } catch (e) {
    const message = e instanceof TikTokError ? e.message : "Erro ao buscar dados do TikTok"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
