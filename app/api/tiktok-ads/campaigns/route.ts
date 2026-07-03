import { NextResponse } from "next/server"
import { tiktok, advertiserId, num, dateRange, TikTokError } from "@/lib/tiktok-ads"
import { getTikTokRequestCredentials } from "@/lib/integrations/tiktok-ads-request"

/** Campanhas com métricas dos últimos 30 dias. */
export async function GET() {
  const credentials = await getTikTokRequestCredentials()

  if (!credentials) return NextResponse.json({ configured: false })

  const { start, end } = dateRange(30, 0)
  try {
    const data = await tiktok("/report/integrated/get/", {
      advertiser_id: advertiserId(credentials),
      report_type: "BASIC",
      data_level: "AUCTION_CAMPAIGN",
      dimensions: ["campaign_id"],
      metrics: ["campaign_name", "spend", "impressions", "clicks", "ctr", "conversion", "cost_per_conversion"],
      start_date: start,
      end_date: end,
      page_size: 100,
    }, credentials)

    const campaigns = (data.list ?? [])
      .map((r: any) => ({
        id: r.dimensions.campaign_id,
        name: r.metrics.campaign_name || r.dimensions.campaign_id,
        spend: num(r.metrics.spend),
        impressions: num(r.metrics.impressions),
        clicks: num(r.metrics.clicks),
        ctr: num(r.metrics.ctr),
        conversions: num(r.metrics.conversion),
        costPerConversion: num(r.metrics.cost_per_conversion),
      }))
      .sort((a: any, b: any) => b.spend - a.spend)

    return NextResponse.json({ configured: true, campaigns })
  } catch (e) {
    const message = e instanceof TikTokError ? e.message : "Erro ao buscar campanhas do TikTok"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
