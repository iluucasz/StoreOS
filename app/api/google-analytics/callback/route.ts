import { type NextRequest, NextResponse } from "next/server"
import { clientId, clientSecret } from "@/lib/google-analytics"

/**
 * Recebe o código OAuth, troca por tokens e exibe o refresh_token para colar no
 * .env.local como GOOGLE_ANALYTICS_REFRESH_TOKEN.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")

  if (oauthError) return NextResponse.json({ error: oauthError }, { status: 400 })
  if (!code) return NextResponse.json({ error: "Código de autorização ausente" }, { status: 400 })

  const redirectUri =
    process.env.GOOGLE_ANALYTICS_REDIRECT_URI || `${origin}/api/google-analytics/callback`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId()!,
      client_secret: clientSecret()!,
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
          "Não veio refresh_token. Revogue o acesso do app em myaccount.google.com/permissions e tente novamente (precisa de access_type=offline + prompt=consent).",
        detail: data,
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    ok: true,
    instrucao:
      "Copie o refresh_token abaixo e adicione no .env.local como GOOGLE_ANALYTICS_REFRESH_TOKEN. Depois reinicie o servidor.",
    refresh_token: data.refresh_token,
  })
}
