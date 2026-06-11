import { type NextRequest, NextResponse } from "next/server"
import { apiVersion } from "@/lib/meta-ads"

const GRAPH = "https://graph.facebook.com"

/**
 * Troca o código por um token de longa duração (~60 dias) e exibe junto a lista
 * de contas de anúncios, para você colar no .env.local.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error_description") || searchParams.get("error")

  if (oauthError) return NextResponse.json({ error: oauthError }, { status: 400 })
  if (!code) return NextResponse.json({ error: "Código de autorização ausente" }, { status: 400 })

  const clientId = process.env.META_APP_ID
  const clientSecret = process.env.META_APP_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "META_APP_ID/META_APP_SECRET não configurados" }, { status: 400 })
  }

  const redirectUri = process.env.META_REDIRECT_URI || `${origin}/api/meta-ads/callback`
  const v = apiVersion()

  // 1) código → token de curta duração
  const shortRes = await fetch(
    `${GRAPH}/${v}/oauth/access_token?` +
      new URLSearchParams({ client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, code }),
  )
  const shortData = await shortRes.json().catch(() => ({}))
  if (!shortData.access_token) {
    return NextResponse.json({ ok: false, error: "Falha ao obter token", detail: shortData }, { status: 400 })
  }

  // 2) curta → longa duração
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

  // 3) lista de contas de anúncios disponíveis
  let adAccounts: { id: string; name: string; account_id: string }[] = []
  try {
    const acc = await fetch(
      `${GRAPH}/${v}/me/adaccounts?fields=name,account_id,currency&access_token=${token}`,
    ).then((r) => r.json())
    adAccounts = (acc.data || []).map((a: any) => ({
      id: a.id,
      account_id: a.account_id,
      name: a.name,
    }))
  } catch {
    /* ignora */
  }

  return NextResponse.json({
    ok: true,
    instrucao:
      "Cole o access_token em META_ACCESS_TOKEN e o id (act_...) da conta desejada em META_AD_ACCOUNT_ID no .env.local. Depois reinicie o servidor.",
    access_token: token,
    expires_in: longData.expires_in,
    ad_accounts: adAccounts,
  })
}
