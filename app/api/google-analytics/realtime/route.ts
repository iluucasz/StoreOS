import { NextResponse } from "next/server"
import { runRealtimeReport, parseRows, firstRow, num, GoogleAnalyticsError } from "@/lib/google-analytics"
import { getGoogleAnalyticsRequestCredentials } from "@/lib/integrations/google-analytics-request"

/** Dados em tempo real (últimos 30 minutos) da propriedade GA4. */
export async function GET() {
  const credentials = await getGoogleAnalyticsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false })
  }

  try {
    const [totals, pages, countries, devices] = await Promise.all([
      runRealtimeReport({ metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }] }, credentials),
      runRealtimeReport({
        dimensions: [{ name: "unifiedScreenName" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ desc: true, metric: { metricName: "activeUsers" } }],
        limit: 8,
      }, credentials),
      runRealtimeReport({
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ desc: true, metric: { metricName: "activeUsers" } }],
        limit: 8,
      }, credentials),
      runRealtimeReport({
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ desc: true, metric: { metricName: "activeUsers" } }],
      }, credentials),
    ])

    const t = firstRow(totals)

    return NextResponse.json({
      configured: true,
      activeUsers: num(t.activeUsers),
      pageViews: num(t.screenPageViews),
      pageViewsData: parseRows(pages).map((r) => ({
        page: r.unifiedScreenName || "(sem título)",
        views: num(r.activeUsers),
      })),
      countriesData: parseRows(countries).map((r) => ({
        country: r.country || "(desconhecido)",
        users: num(r.activeUsers),
      })),
      devicesData: parseRows(devices).map((r) => ({
        device: r.deviceCategory || "(outro)",
        users: num(r.activeUsers),
      })),
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar dados em tempo real"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
