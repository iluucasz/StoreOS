import { NextResponse } from "next/server"
import { runReport, parseRows, num, translateChannel, translateToken, GoogleAnalyticsError } from "@/lib/google-analytics"
import { getGoogleAnalyticsRequestCredentials } from "@/lib/integrations/google-analytics-request"

const COLORS = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#8b5cf6", "#ec4899", "#14b8a6"]

/** Aquisição: canais, campanhas UTM e sites de referência (30 dias). */
export async function GET() {
  const credentials = await getGoogleAnalyticsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false })
  }

  const dateRanges = [{ startDate: "30daysAgo", endDate: "yesterday" }]

  try {
    const [channels, campaigns, referrals] = await Promise.all([
      runReport({
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [{ desc: true, metric: { metricName: "totalUsers" } }],
        limit: 7,
      }, credentials),
      runReport({
        dateRanges,
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "conversions" }],
        orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
        limit: 10,
      }, credentials),
      runReport({
        dateRanges,
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "conversions" }],
        dimensionFilter: {
          filter: { fieldName: "sessionMedium", stringFilter: { matchType: "EXACT", value: "referral" } },
        },
        orderBys: [{ desc: true, metric: { metricName: "totalUsers" } }],
        limit: 10,
      }, credentials),
    ])

    const channelRows = parseRows(channels)
    const totalUsers = channelRows.reduce((s, r) => s + num(r.totalUsers), 0) || 1
    const sourceData = channelRows.map((r, i) => ({
      name: translateChannel(r.sessionDefaultChannelGroup || "(outro)"),
      value: Math.round((num(r.totalUsers) / totalUsers) * 100),
      color: COLORS[i % COLORS.length],
    }))

    const campaignData = parseRows(campaigns)
      .filter((r) => r.sessionCampaignName && r.sessionCampaignName !== "(not set)" && r.sessionCampaignName !== "(direct)")
      .map((r) => ({
        name: translateToken(r.sessionCampaignName),
        users: num(r.totalUsers),
        sessions: num(r.sessions),
        conversions: Math.round(num(r.conversions)),
      }))

    const referralData = parseRows(referrals).map((r) => {
      const users = num(r.totalUsers)
      const conversions = num(r.conversions)
      return {
        source: r.sessionSource,
        users,
        sessions: num(r.sessions),
        convRate: `${users ? ((conversions / users) * 100).toFixed(1) : "0.0"}%`,
      }
    })

    return NextResponse.json({ configured: true, sourceData, campaignData, referralData })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar dados de aquisição"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
