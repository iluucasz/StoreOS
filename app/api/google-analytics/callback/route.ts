import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { clientId, clientSecret } from "@/lib/google-analytics"
import { saveUserIntegration } from "@/lib/integrations/store"
import { verifyOAuthState } from "@/lib/integrations/oauth-state"

function redirectWithMessage(origin: string, type: "connected" | "error", message: string) {
  const url = new URL("/marketing/google/analytics", origin)
  url.searchParams.set(type, message)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")
  const state = verifyOAuthState(searchParams.get("state"), "google_analytics")

  if (oauthError) return redirectWithMessage(origin, "error", oauthError)
  if (!code) return redirectWithMessage(origin, "error", "Código de autorização ausente.")
  if (!state || state.userId !== user.id) {
    return redirectWithMessage(origin, "error", "Sessão de conexão inválida ou expirada. Tente novamente.")
  }

  const propertyId = (state.data?.propertyId || "").replace(/\D/g, "")
  if (!propertyId) return redirectWithMessage(origin, "error", "Property ID do GA4 ausente.")

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

  if (!res.ok || !data.refresh_token) {
    return redirectWithMessage(
      origin,
      "error",
      "O Google não retornou um refresh token. Revogue o acesso anterior do app e tente conectar novamente.",
    )
  }

  await saveUserIntegration({
    userId: user.id,
    provider: "google_analytics",
    providerAccountId: propertyId,
    accountName: `GA4 ${propertyId}`,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    scope: data.scope,
    expiresAt: data.expires_in ? new Date(Date.now() + Number(data.expires_in) * 1000) : null,
    metadata: { propertyId },
  })

  return redirectWithMessage(origin, "connected", "google_analytics")
}
