import { type NextRequest, NextResponse } from "next/server"
import { META_SCOPE, apiVersion } from "@/lib/meta-ads"

/** Inicia o login OAuth da Meta para gerar um token de acesso com ads_read. */
export async function GET(request: NextRequest) {
  const clientId = process.env.META_APP_ID
  if (!clientId) {
    return NextResponse.json({ error: "META_APP_ID não configurado no .env.local" }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const redirectUri = process.env.META_REDIRECT_URI || `${origin}/api/meta-ads/callback`

  const authUrl =
    `https://www.facebook.com/${apiVersion()}/dialog/oauth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: META_SCOPE,
    }).toString()

  return NextResponse.redirect(authUrl)
}
