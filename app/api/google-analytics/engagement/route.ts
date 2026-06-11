import { NextResponse } from "next/server"
import { isConfigured, runReport, parseRows, num, gaDate, GoogleAnalyticsError } from "@/lib/google-analytics"

function mmss(seconds: number): string {
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `00:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
}

/** Engajamento: série diária, páginas mais vistas e dispositivos (7/30 dias). */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  try {
    const [daily, pages, devices] = await Promise.all([
      runReport({
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }, { name: "bounceRate" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }, { name: "bounceRate" }],
        orderBys: [{ desc: true, metric: { metricName: "screenPageViews" } }],
        limit: 10,
      }),
      runReport({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }, { name: "averageSessionDuration" }, { name: "bounceRate" }],
        orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
      }),
    ])

    const engagementData = parseRows(daily).map((r) => ({
      date: gaDate(r.date),
      pageviews: num(r.screenPageViews),
      avgSessionDuration: Math.round(num(r.averageSessionDuration)),
      bounceRate: Math.round(num(r.bounceRate) * 100),
    }))

    const pageData = parseRows(pages).map((r) => ({
      page: r.pagePath,
      pageviews: num(r.screenPageViews),
      avgTimeOnPage: mmss(num(r.averageSessionDuration)),
      bounceRate: `${Math.round(num(r.bounceRate) * 100)}%`,
    }))

    const deviceData = parseRows(devices).map((r) => ({
      device: r.deviceCategory,
      sessions: num(r.sessions),
      avgSessionDuration: mmss(num(r.averageSessionDuration)),
      bounceRate: `${Math.round(num(r.bounceRate) * 100)}%`,
    }))

    return NextResponse.json({ configured: true, engagementData, pageData, deviceData })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar dados de engajamento"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
