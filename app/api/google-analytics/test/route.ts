import { NextResponse } from "next/server"
import { isConfigured, runReport, firstRow, GoogleAnalyticsError } from "@/lib/google-analytics"

/** Verifica credenciais e se a propriedade GA4 responde. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, connected: false })
  }

  try {
    const resp = await runReport({
      dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      metrics: [{ name: "activeUsers" }],
    })
    const row = firstRow(resp)
    return NextResponse.json({
      configured: true,
      connected: true,
      activeUsers7d: row.activeUsers ?? 0,
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao conectar à GA4 Data API"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
