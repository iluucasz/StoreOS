import { type NextRequest, NextResponse } from "next/server"
import { ANALYTICS_SCOPE, clientId } from "@/lib/google-analytics"

/**
 * Inicia o consentimento OAuth para gerar um refresh token com acesso de leitura
 * ao Google Analytics. Reutiliza o mesmo OAuth client do Google Ads.
 */
export async function GET(request: NextRequest) {
  const id = clientId()
  if (!id) {
    return NextResponse.json(
      { error: "GOOGLE_ADS_CLIENT_ID (ou GOOGLE_ANALYTICS_CLIENT_ID) não configurado no .env.local" },
      { status: 400 },
    )
  }

  const origin = new URL(request.url).origin
  const redirectUri =
    process.env.GOOGLE_ANALYTICS_REDIRECT_URI || `${origin}/api/google-analytics/callback`

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ANALYTICS_SCOPE,
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    }).toString()

  return NextResponse.redirect(authUrl)
}
