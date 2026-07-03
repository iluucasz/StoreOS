import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { META_SCOPE, apiVersion, appId } from "@/lib/meta-ads"
import { createOAuthState } from "@/lib/integrations/oauth-state"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const clientId = appId()
  if (!clientId) {
    return NextResponse.json({ error: "META_APP_ID não configurado no ambiente do app." }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.META_REDIRECT_URI || `${origin}/api/meta-ads/callback`
  const state = createOAuthState({ userId: user.id, provider: "meta_ads" })

  const authUrl =
    `https://www.facebook.com/${apiVersion()}/dialog/oauth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: META_SCOPE,
      state,
    }).toString()

  return NextResponse.redirect(authUrl)
}
