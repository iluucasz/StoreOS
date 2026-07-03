import { NextResponse } from "next/server"
import { tiktok, advertiserId, TikTokError } from "@/lib/tiktok-ads"
import { getTikTokRequestCredentials } from "@/lib/integrations/tiktok-ads-request"

/** Verifica credenciais e acesso ao anunciante. */
export async function GET() {
  const credentials = await getTikTokRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, connected: false })
  }
  try {
    const data = await tiktok("/advertiser/info/", {
      advertiser_ids: [advertiserId(credentials)],
      fields: ["name", "currency"],
    }, credentials)
    const adv = data?.list?.[0]
    return NextResponse.json({
      configured: true,
      connected: true,
      account: adv ? { name: adv.name, currency: adv.currency } : null,
    })
  } catch (e) {
    const message = e instanceof TikTokError ? e.message : "Erro ao conectar ao TikTok"
    return NextResponse.json({ configured: true, connected: false, error: message })
  }
}
