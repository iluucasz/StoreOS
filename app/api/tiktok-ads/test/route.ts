import { NextResponse } from "next/server"
import { isConfigured, tiktok, advertiserId, TikTokError } from "@/lib/tiktok-ads"

/** Verifica credenciais e acesso ao anunciante. */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, connected: false })
  }
  try {
    const data = await tiktok("/advertiser/info/", {
      advertiser_ids: [advertiserId()],
      fields: ["name", "currency"],
    })
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
