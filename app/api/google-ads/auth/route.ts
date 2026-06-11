import { type NextRequest, NextResponse } from "next/server"
import { ADS_SCOPE } from "@/lib/google-ads"

/**
 * Inicia o consentimento OAuth do Google para gerar um refresh token com acesso
 * à Google Ads API. Acesse /api/google-ads/auth no navegador (logado na conta
 * Google dona da conta de anúncios).
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_ADS_CLIENT_ID não configurado no .env.local" },
      { status: 400 },
    )
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || `${origin}/api/google-ads/callback`

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ADS_SCOPE,
      access_type: "offline",
      prompt: "consent", // força a emissão de um novo refresh_token
      include_granted_scopes: "true",
    }).toString()

  return NextResponse.redirect(authUrl)
}
