import { type NextRequest, NextResponse } from "next/server"
import { TIKTOK_AUTH_PORTAL, appId } from "@/lib/tiktok-ads"

/** Inicia a autorização do TikTok for Business. */
export async function GET(request: NextRequest) {
  const id = appId()
  if (!id) {
    return NextResponse.json({ error: "TIKTOK_APP_ID não configurado no .env.local" }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${origin}/api/tiktok-ads/callback`

  const authUrl =
    `${TIKTOK_AUTH_PORTAL}?` +
    new URLSearchParams({
      app_id: id,
      state: Math.random().toString(36).slice(2),
      redirect_uri: redirectUri,
    }).toString()

  return NextResponse.redirect(authUrl)
}
