import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { ADS_SCOPE, clientId } from "@/lib/google-ads"
import { createOAuthState } from "@/lib/integrations/oauth-state"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const id = clientId()
  if (!id) {
    return NextResponse.json({ error: "GOOGLE_ADS_CLIENT_ID não configurado no ambiente do app." }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || `${origin}/api/google-ads/callback`
  const state = createOAuthState({ userId: user.id, provider: "google_ads" })

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ADS_SCOPE,
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      state,
    }).toString()

  return NextResponse.redirect(authUrl)
}
