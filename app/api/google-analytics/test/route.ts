import { NextResponse } from "next/server"
import { runReport, firstRow, GoogleAnalyticsError } from "@/lib/google-analytics"
import { getGoogleAnalyticsRequestCredentials } from "@/lib/integrations/google-analytics-request"

/** Verifica credenciais e se a propriedade GA4 responde. */
export async function GET() {
  const credentials = await getGoogleAnalyticsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, connected: false })
  }

  try {
    const resp = await runReport(
      {
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        metrics: [{ name: "activeUsers" }],
      },
      credentials,
    )
    const row = firstRow(resp)
    return NextResponse.json({
      configured: true,
      connected: true,
      account: { id: credentials.propertyId, name: `GA4 ${credentials.propertyId}` },
      activeUsers7d: row.activeUsers ?? 0,
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao conectar à GA4 Data API"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
