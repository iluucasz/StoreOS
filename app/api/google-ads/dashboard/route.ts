import { NextResponse } from "next/server"
import { isConfigured, runQuery, fromMicros, num, dateRange, GoogleAdsError } from "@/lib/google-ads"

function pct(curr: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

function ddmm(isoDate: string): string {
  const [, mm, dd] = isoDate.split("-")
  return `${dd}/${mm}`
}

/** Métricas-resumo, série diária e desempenho por campanha/palavra-chave. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  const c = dateRange(7, 0) // últimos 7 dias (até ontem)
  const p = dateRange(7, 7) // 7 dias anteriores (comparação)

  try {
    const [daily, prevAgg, byCampaign, byKeyword] = await Promise.all([
      runQuery(
        `SELECT segments.date, metrics.cost_micros, metrics.impressions, metrics.clicks,
                metrics.conversions, metrics.conversions_value
         FROM customer
         WHERE segments.date BETWEEN '${c.start}' AND '${c.end}'
         ORDER BY segments.date`,
      ),
      runQuery(
        `SELECT metrics.cost_micros, metrics.conversions, metrics.conversions_value
         FROM customer
         WHERE segments.date BETWEEN '${p.start}' AND '${p.end}'`,
      ),
      runQuery(
        `SELECT campaign.name, metrics.cost_micros
         FROM campaign
         WHERE segments.date BETWEEN '${c.start}' AND '${c.end}' AND metrics.cost_micros > 0
         ORDER BY metrics.cost_micros DESC
         LIMIT 8`,
      ),
      runQuery(
        `SELECT ad_group_criterion.keyword.text, metrics.cost_micros
         FROM keyword_view
         WHERE segments.date BETWEEN '${c.start}' AND '${c.end}' AND metrics.cost_micros > 0
         ORDER BY metrics.cost_micros DESC
         LIMIT 8`,
      ),
    ])

    const series = daily.map((r) => ({
      date: ddmm(r.segments.date),
      spend: Math.round(fromMicros(r.metrics.costMicros) * 100) / 100,
      impressions: num(r.metrics.impressions),
      clicks: num(r.metrics.clicks),
      conversions: Math.round(num(r.metrics.conversions) * 10) / 10,
    }))

    const cost = daily.reduce((s, r) => s + fromMicros(r.metrics.costMicros), 0)
    const conversions = daily.reduce((s, r) => s + num(r.metrics.conversions), 0)
    const convValue = daily.reduce((s, r) => s + num(r.metrics.conversionsValue), 0)
    const cpa = conversions ? cost / conversions : 0
    const roas = cost ? convValue / cost : 0

    const prev = prevAgg[0]?.metrics
    const pCost = fromMicros(prev?.costMicros)
    const pConv = num(prev?.conversions)
    const pConvValue = num(prev?.conversionsValue)
    const pCpa = pConv ? pCost / pConv : 0
    const pRoas = pCost ? pConvValue / pCost : 0

    return NextResponse.json({
      configured: true,
      totals: {
        cost,
        conversions,
        cpa,
        roas,
        costDelta: pct(cost, pCost),
        conversionsDelta: pct(conversions, pConv),
        cpaDelta: pct(cpa, pCpa),
        roasDelta: pct(roas, pRoas),
      },
      series,
      byCampaign: byCampaign.map((r) => ({
        name: r.campaign.name,
        value: Math.round(fromMicros(r.metrics.costMicros) * 100) / 100,
      })),
      byKeyword: byKeyword.map((r) => ({
        name: r.adGroupCriterion.keyword.text,
        value: Math.round(fromMicros(r.metrics.costMicros) * 100) / 100,
      })),
    })
  } catch (e) {
    const message = e instanceof GoogleAdsError ? e.message : "Erro ao buscar dados do Google Ads"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
