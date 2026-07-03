import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { clientId, clientSecret, developerToken, listAccessibleCustomers } from "@/lib/google-ads"
import { verifyOAuthState } from "@/lib/integrations/oauth-state"
import { saveUserIntegration } from "@/lib/integrations/store"

function redirectWithMessage(origin: string, type: "connected" | "error", message: string) {
  const url = new URL("/marketing/google/ads", origin)
  url.searchParams.set(type, message)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")
  const state = verifyOAuthState(searchParams.get("state"), "google_ads")

  if (oauthError) return redirectWithMessage(origin, "error", oauthError)
  if (!code) return redirectWithMessage(origin, "error", "Código de autorização ausente.")
  if (!state || state.userId !== user.id) {
    return redirectWithMessage(origin, "error", "Sessão de conexão inválida ou expirada. Tente novamente.")
  }

  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || `${origin}/api/google-ads/callback`

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

  let accessibleCustomers: string[] = []
  try {
    accessibleCustomers = await listAccessibleCustomers({
      clientId: clientId()!,
      clientSecret: clientSecret()!,
      developerToken: developerToken()!,
      refreshToken: data.refresh_token,
    })
  } catch {
    accessibleCustomers = []
  }

  const selectedCustomerId = accessibleCustomers[0] ?? ""
  await saveUserIntegration({
    userId: user.id,
    provider: "google_ads",
    providerAccountId: selectedCustomerId || null,
    accountName: selectedCustomerId ? `Google Ads ${selectedCustomerId}` : "Google Ads",
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    scope: data.scope,
    expiresAt: data.expires_in ? new Date(Date.now() + Number(data.expires_in) * 1000) : null,
    status: selectedCustomerId ? "connected" : "needs_reauth",
    metadata: { accessibleCustomers },
  })

  return redirectWithMessage(origin, selectedCustomerId ? "connected" : "error", selectedCustomerId ? "google_ads" : "Nenhuma conta Google Ads acessível foi encontrada.")
}
