import { NextResponse } from "next/server"
import {
  runQuery,
  fromMicros,
  num,
  translateStatus,
  translateMatchType,
  GoogleAdsError,
} from "@/lib/google-ads"
import { getGoogleAdsRequestCredentials } from "@/lib/integrations/google-ads-request"

/** Palavras-chave (keyword_view) com métricas dos últimos 30 dias. */
export async function GET() {
  const credentials = await getGoogleAdsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false })
  }

  try {
    const rows = await runQuery(
      `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
              ad_group_criterion.status, ad_group_criterion.quality_info.quality_score,
              campaign.name, metrics.clicks, metrics.impressions, metrics.ctr,
              metrics.average_cpc, metrics.cost_micros, metrics.conversions
       FROM keyword_view
       WHERE segments.date DURING LAST_30_DAYS
       ORDER BY metrics.cost_micros DESC
       LIMIT 50`,
      credentials,
    )

    const keywords = rows.map((r, i) => ({
      id: i,
      keyword: r.adGroupCriterion.keyword.text,
      matchType: translateMatchType(r.adGroupCriterion.keyword.matchType),
      campaign: r.campaign.name,
      status: translateStatus(r.adGroupCriterion.status),
      qualityScore: r.adGroupCriterion.qualityInfo?.qualityScore ?? null,
      clicks: num(r.metrics.clicks),
      impressions: num(r.metrics.impressions),
      ctr: num(r.metrics.ctr) * 100,
      avgCpc: fromMicros(r.metrics.averageCpc),
      conversions: num(r.metrics.conversions),
    }))

    return NextResponse.json({ configured: true, keywords })
  } catch (e) {
    const message = e instanceof GoogleAdsError ? e.message : "Erro ao buscar palavras-chave do Google Ads"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
