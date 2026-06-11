import { type NextRequest, NextResponse } from "next/server"

/**
 * Recebe o código OAuth, troca por tokens e exibe o refresh_token para você
 * colar no .env.local como GOOGLE_ADS_REFRESH_TOKEN (mesmo fluxo da Shopify).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")

  if (oauthError) {
    return NextResponse.json({ error: oauthError }, { status: 400 })
  }
  if (!code) {
    return NextResponse.json({ error: "Código de autorização ausente" }, { status: 400 })
  }

  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || `${origin}/api/google-ads/callback`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!data.refresh_token) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não veio refresh_token. Revogue o acesso do app em myaccount.google.com/permissions e tente novamente (o fluxo precisa de access_type=offline + prompt=consent).",
        detail: data,
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    ok: true,
    instrucao:
      "Copie o refresh_token abaixo e adicione no seu .env.local como GOOGLE_ADS_REFRESH_TOKEN. Depois reinicie o servidor (npm run dev).",
    refresh_token: data.refresh_token,
  })
}
