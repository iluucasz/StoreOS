import { NextResponse } from "next/server"
import { isConfigured, runQuery, GoogleAdsError } from "@/lib/google-ads"

/** Verifica se as credenciais estão presentes e se a API responde. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, connected: false })
  }

  try {
    const rows = await runQuery(
      "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1",
    )
    const customer = rows[0]?.customer
    return NextResponse.json({
      configured: true,
      connected: true,
      account: customer
        ? { id: customer.id, name: customer.descriptiveName, currency: customer.currencyCode }
        : null,
    })
  } catch (e) {
    const message = e instanceof GoogleAdsError ? e.message : "Erro ao conectar à Google Ads API"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
