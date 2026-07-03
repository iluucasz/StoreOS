import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { TIKTOK_TOKEN_URL, appId, appSecret } from "@/lib/tiktok-ads"
import { verifyOAuthState } from "@/lib/integrations/oauth-state"
import { saveUserIntegration } from "@/lib/integrations/store"

function redirectWithMessage(origin: string, type: "connected" | "error", message: string) {
  const url = new URL("/marketing/tiktok", origin)
  url.searchParams.set(type, message)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const { searchParams, origin } = new URL(request.url)
  const authCode = searchParams.get("auth_code") || searchParams.get("code")
  const oauthError = searchParams.get("error_description") || searchParams.get("error")
  const state = verifyOAuthState(searchParams.get("state"), "tiktok_ads")

  if (oauthError) return redirectWithMessage(origin, "error", oauthError)
  if (!authCode) return redirectWithMessage(origin, "error", "auth_code ausente.")
  if (!state || state.userId !== user.id) {
    return redirectWithMessage(origin, "error", "Sessão de conexão inválida ou expirada. Tente novamente.")
  }

  const id = appId()
  const secret = appSecret()
  if (!id || !secret) {
    return redirectWithMessage(origin, "error", "TIKTOK_APP_ID/TIKTOK_APP_SECRET não configurados.")
  }

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: id, secret, auth_code: authCode }),
  })
  const data = await res.json().catch(() => ({}))

  if (data.code !== 0 || !data.data?.access_token) {
    return redirectWithMessage(origin, "error", data.message || "Falha ao obter token do TikTok.")
  }

  const advertiserIds: string[] = data.data.advertiser_ids || []
  const advertiserId = advertiserIds[0] ?? ""

  await saveUserIntegration({
    userId: user.id,
    provider: "tiktok_ads",
    providerAccountId: advertiserId || null,
    accountName: advertiserId ? `TikTok Ads ${advertiserId}` : "TikTok Ads",
    accessToken: data.data.access_token,
    refreshToken: data.data.refresh_token,
    scope: Array.isArray(data.data.scope) ? data.data.scope.join(",") : data.data.scope,
    status: advertiserId ? "connected" : "needs_reauth",
    metadata: { advertiserIds },
  })

  return redirectWithMessage(
    origin,
    advertiserId ? "connected" : "error",
    advertiserId ? "tiktok_ads" : "Nenhum anunciante do TikTok foi encontrado.",
  )
}
