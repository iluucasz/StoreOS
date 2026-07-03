import { NextResponse } from "next/server"
import { runQuery, GoogleAdsError } from "@/lib/google-ads"
import { getGoogleAdsRequestCredentials } from "@/lib/integrations/google-ads-request"

/** Verifica se as credenciais estão presentes e se a API responde. */
export async function GET() {
  const credentials = await getGoogleAdsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, connected: false })
  }

  try {
    const rows = await runQuery(
      "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1",
      credentials,
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
