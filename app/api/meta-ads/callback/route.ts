import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { apiVersion, appId, appSecret } from "@/lib/meta-ads"
import { verifyOAuthState } from "@/lib/integrations/oauth-state"
import { saveUserIntegration } from "@/lib/integrations/store"

const GRAPH = "https://graph.facebook.com"

function redirectWithMessage(origin: string, type: "connected" | "error", message: string) {
  const url = new URL("/marketing/facebook", origin)
  url.searchParams.set(type, message)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error_description") || searchParams.get("error")
  const state = verifyOAuthState(searchParams.get("state"), "meta_ads")

  if (oauthError) return redirectWithMessage(origin, "error", oauthError)
  if (!code) return redirectWithMessage(origin, "error", "Código de autorização ausente.")
  if (!state || state.userId !== user.id) {
    return redirectWithMessage(origin, "error", "Sessão de conexão inválida ou expirada. Tente novamente.")
  }

  const clientId = appId()
  const clientSecret = appSecret()
  if (!clientId || !clientSecret) {
    return redirectWithMessage(origin, "error", "META_APP_ID/META_APP_SECRET não configurados.")
  }

  const redirectUri = process.env.META_REDIRECT_URI || `${origin}/api/meta-ads/callback`
  const v = apiVersion()

  const shortRes = await fetch(
    `${GRAPH}/${v}/oauth/access_token?` +
      new URLSearchParams({ client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, code }),
  )
  const shortData = await shortRes.json().catch(() => ({}))
  if (!shortData.access_token) {
    return redirectWithMessage(origin, "error", "Falha ao obter token da Meta.")
  }

  const longRes = await fetch(
    `${GRAPH}/${v}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: clientId,
        client_secret: clientSecret,
        fb_exchange_token: shortData.access_token,
      }),
  )
  const longData = await longRes.json().catch(() => ({}))
  const token = longData.access_token || shortData.access_token

  let adAccounts: { id: string; name: string; account_id: string; currency?: string }[] = []
  try {
    const acc = await fetch(
      `${GRAPH}/${v}/me/adaccounts?fields=name,account_id,currency&access_token=${token}`,
    ).then((r) => r.json())
    adAccounts = (acc.data || []).map((a: any) => ({
      id: a.id,
      account_id: a.account_id,
      name: a.name,
      currency: a.currency,
    }))
  } catch {
    adAccounts = []
  }

  const selected = adAccounts[0]
  await saveUserIntegration({
    userId: user.id,
    provider: "meta_ads",
    providerAccountId: selected?.id ?? null,
    accountName: selected?.name ?? "Meta Ads",
    accessToken: token,
    expiresAt: longData.expires_in ? new Date(Date.now() + Number(longData.expires_in) * 1000) : null,
    status: selected ? "connected" : "needs_reauth",
    metadata: { adAccounts },
  })

  return redirectWithMessage(
    origin,
    selected ? "connected" : "error",
    selected ? "meta_ads" : "Nenhuma conta de anúncios da Meta foi encontrada.",
  )
}
