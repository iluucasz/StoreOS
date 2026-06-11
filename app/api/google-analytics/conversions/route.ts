import { NextResponse } from "next/server"
import { isConfigured, runReport, parseRows, firstRow, num, gaDate, pct, GoogleAnalyticsError } from "@/lib/google-analytics"

/** Conversões: métricas-resumo, tendência (14d) e por evento (30d). */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  const totalsMetrics = [{ name: "conversions" }, { name: "sessions" }, { name: "totalRevenue" }]

  try {
    const [curr, prev, trend, goals] = await Promise.all([
      runReport({ dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }], metrics: totalsMetrics }),
      runReport({ dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }], metrics: totalsMetrics }),
      runReport({
        dateRanges: [{ startDate: "14daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "conversions" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "conversions" }, { name: "totalRevenue" }],
        metricFilter: {
          filter: { fieldName: "conversions", numericFilter: { operation: "GREATER_THAN", value: { doubleValue: 0 } } },
        },
        orderBys: [{ desc: true, metric: { metricName: "conversions" } }],
        limit: 10,
      }),
    ])

    const c = firstRow(curr)
    const p = firstRow(prev)

    const conversions = num(c.conversions)
    const sessions = num(c.sessions)
    const value = num(c.totalRevenue)
    const convRate = sessions ? (conversions / sessions) * 100 : 0
    const avgValue = conversions ? value / conversions : 0

    const pConversions = num(p.conversions)
    const pSessions = num(p.sessions)
    const pValue = num(p.totalRevenue)
    const pConvRate = pSessions ? (pConversions / pSessions) * 100 : 0
    const pAvgValue = pConversions ? pValue / pConversions : 0

    const conversionTrendsData = parseRows(trend).map((r) => {
      const conv = num(r.conversions)
      const sess = num(r.sessions)
      return {
        date: gaDate(r.date),
        conversions: Math.round(conv),
        conversionRate: sess ? Math.round((conv / sess) * 1000) / 10 : 0,
      }
    })

    const goalCompletionsData = parseRows(goals).map((r) => {
      const completions = num(r.conversions)
      return {
        goal: r.eventName,
        completions: Math.round(completions),
        value: Math.round(num(r.totalRevenue)),
        conversionRate: sessions ? Math.round((completions / sessions) * 1000) / 10 : 0,
      }
    })

    return NextResponse.json({
      configured: true,
      totals: {
        conversions,
        convRate,
        value,
        avgValue,
        conversionsDelta: pct(conversions, pConversions),
        convRateDelta: pct(convRate, pConvRate),
        valueDelta: pct(value, pValue),
        avgValueDelta: pct(avgValue, pAvgValue),
      },
      conversionTrendsData,
      goalCompletionsData,
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar conversões"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
