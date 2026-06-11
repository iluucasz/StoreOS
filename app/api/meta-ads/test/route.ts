import { NextResponse } from "next/server"
import { isConfigured, graph, accountId, MetaError } from "@/lib/meta-ads"

/** Verifica credenciais e acesso à conta de anúncios. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, connected: false })
  }
  try {
    const data = await graph(accountId(), { fields: "name,currency,account_status" })
    return NextResponse.json({
      configured: true,
      connected: true,
      account: { name: data.name, currency: data.currency },
    })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao conectar à Meta"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
