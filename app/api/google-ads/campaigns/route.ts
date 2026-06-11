import { NextResponse } from "next/server"
import { isConfigured, runQuery, fromMicros, num, translateStatus, GoogleAdsError } from "@/lib/google-ads"

/** Lista de campanhas com métricas dos últimos 30 dias. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  try {
    const rows = await runQuery(
      `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros,
              metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.ctr,
              metrics.conversions, metrics.cost_per_conversion, metrics.conversions_value
       FROM campaign
       WHERE segments.date DURING LAST_30_DAYS
       ORDER BY metrics.cost_micros DESC`,
    )

    const campaigns = rows.map((r) => {
      const cost = fromMicros(r.metrics.costMicros)
      const convValue = num(r.metrics.conversionsValue)
      return {
        id: r.campaign.id,
        name: r.campaign.name,
        status: translateStatus(r.campaign.status),
        dailyBudget: fromMicros(r.campaignBudget?.amountMicros),
        spent: cost,
        clicks: num(r.metrics.clicks),
        impressions: num(r.metrics.impressions),
        ctr: num(r.metrics.ctr) * 100,
        conversions: num(r.metrics.conversions),
        costPerConversion: fromMicros(r.metrics.costPerConversion),
        roas: cost ? convValue / cost : 0,
      }
    })

    return NextResponse.json({ configured: true, campaigns })
  } catch (e) {
    const message = e instanceof GoogleAdsError ? e.message : "Erro ao buscar campanhas do Google Ads"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
