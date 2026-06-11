import { NextResponse } from "next/server"
import { isConfigured, runReport, parseRows, firstRow, num, gaDate, pct, translateChannel, GoogleAnalyticsError } from "@/lib/google-analytics"

/** Visão geral: métricas-resumo, séries de 7 dias, canais e funil. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  try {
    const totalsMetrics = [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "totalRevenue" },
      { name: "ecommercePurchases" },
    ]

    const [curr, prev, daily, channels, funnel] = await Promise.all([
      runReport({ dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }], metrics: totalsMetrics }),
      runReport({ dateRanges: [{ startDate: "14daysAgo", endDate: "8daysAgo" }], metrics: totalsMetrics }),
      runReport({
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport({
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
        limit: 6,
      }),
      runReport({
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "addToCarts" },
          { name: "checkouts" },
          { name: "ecommercePurchases" },
        ],
      }),
    ])

    const c = firstRow(curr)
    const p = firstRow(prev)

    const users = num(c.activeUsers)
    const sessions = num(c.sessions)
    const revenue = num(c.totalRevenue)
    const purchases = num(c.ecommercePurchases)
    const convRate = sessions ? (purchases / sessions) * 100 : 0

    const pUsers = num(p.activeUsers)
    const pSessions = num(p.sessions)
    const pRevenue = num(p.totalRevenue)
    const pPurchases = num(p.ecommercePurchases)
    const pConvRate = pSessions ? (pPurchases / pSessions) * 100 : 0

    const usersData = parseRows(daily).map((r) => ({
      date: gaDate(r.date),
      users: num(r.activeUsers),
      newUsers: num(r.newUsers),
      sessions: num(r.sessions),
    }))
    const engagementData = parseRows(daily).map((r) => ({
      date: gaDate(r.date),
      pageviews: num(r.screenPageViews),
      avgSessionDuration: Math.round(num(r.averageSessionDuration)),
    }))

    const channelRows = parseRows(channels)
    const totalChannelSessions = channelRows.reduce((s, r) => s + num(r.sessions), 0) || 1
    const sourceData = channelRows.map((r) => ({
      name: translateChannel(r.sessionDefaultChannelGroup || "(outro)"),
      value: Math.round((num(r.sessions) / totalChannelSessions) * 100),
    }))

    const f = firstRow(funnel)
    const conversionData = [
      { name: "Visualizações", value: num(f.screenPageViews) },
      { name: "Adições ao Carrinho", value: num(f.addToCarts) },
      { name: "Checkouts Iniciados", value: num(f.checkouts) },
      { name: "Compras", value: num(f.ecommercePurchases) },
    ]

    return NextResponse.json({
      configured: true,
      totals: {
        users,
        sessions,
        convRate,
        revenue,
        usersDelta: pct(users, pUsers),
        sessionsDelta: pct(sessions, pSessions),
        convRateDelta: pct(convRate, pConvRate),
        revenueDelta: pct(revenue, pRevenue),
      },
      usersData,
      engagementData,
      sourceData,
      conversionData,
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar dados do Google Analytics"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
