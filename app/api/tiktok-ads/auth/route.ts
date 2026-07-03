import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { TIKTOK_AUTH_PORTAL, appId } from "@/lib/tiktok-ads"
import { createOAuthState } from "@/lib/integrations/oauth-state"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const id = appId()
  if (!id) {
    return NextResponse.json({ error: "TIKTOK_APP_ID não configurado no ambiente do app." }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${origin}/api/tiktok-ads/callback`
  const state = createOAuthState({ userId: user.id, provider: "tiktok_ads" })

  const authUrl =
    `${TIKTOK_AUTH_PORTAL}?` +
    new URLSearchParams({
      app_id: id,
      state,
      redirect_uri: redirectUri,
    }).toString()

  return NextResponse.redirect(authUrl)
}
