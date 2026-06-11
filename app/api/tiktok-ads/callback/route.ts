import { type NextRequest, NextResponse } from "next/server"
import { TIKTOK_TOKEN_URL, appId, appSecret } from "@/lib/tiktok-ads"

/**
 * Recebe o auth_code, troca por um access_token e exibe o token + os
 * advertiser_ids autorizados para colar no .env.local.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const authCode = searchParams.get("auth_code") || searchParams.get("code")
  if (!authCode) {
    return NextResponse.json({ error: "auth_code ausente" }, { status: 400 })
  }

  const id = appId()
  const secret = appSecret()
  if (!id || !secret) {
    return NextResponse.json({ error: "TIKTOK_APP_ID/TIKTOK_APP_SECRET não configurados" }, { status: 400 })
  }

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: id, secret, auth_code: authCode }),
  })
  const data = await res.json().catch(() => ({}))

  if (data.code !== 0 || !data.data?.access_token) {
    return NextResponse.json({ ok: false, error: data.message || "Falha ao obter token", detail: data }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    instrucao:
      "Cole o access_token em TIKTOK_ACCESS_TOKEN e um dos advertiser_ids em TIKTOK_ADVERTISER_ID no .env.local. Depois reinicie o servidor.",
    access_token: data.data.access_token,
    advertiser_ids: data.data.advertiser_ids,
    scope: data.data.scope,
  })
}
