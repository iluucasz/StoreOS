import { NextResponse } from "next/server"
import { graph, accountId, MetaError } from "@/lib/meta-ads"
import { getMetaRequestCredentials } from "@/lib/integrations/meta-ads-request"

/** Verifica credenciais e acesso à conta de anúncios. */
export async function GET() {
  const credentials = await getMetaRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, connected: false })
  }
  try {
    const data = await graph(accountId(credentials), { fields: "name,currency,account_status" }, credentials)
    return NextResponse.json({
      configured: true,
      connected: true,
      account: { id: credentials.adAccountId, name: data.name, currency: data.currency },
    })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao conectar à Meta"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
