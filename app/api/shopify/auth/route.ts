import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { createOAuthState } from "@/lib/integrations/oauth-state"
import { SHOPIFY_SCOPES, clientId, normalizeShopDomain } from "@/lib/shopify"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const id = clientId()
  if (!id) {
    return NextResponse.json({ error: "SHOPIFY_CLIENT_ID não configurado no ambiente do app." }, { status: 400 })
  }

  const { searchParams, origin } = new URL(request.url)
  const shop = normalizeShopDomain(searchParams.get("shop"))
  if (!shop) {
    return NextResponse.json({ error: "Informe o domínio da loja Shopify." }, { status: 400 })
  }

  const redirectUri = process.env.SHOPIFY_REDIRECT_URI || `${origin}/api/shopify/callback`
  const state = createOAuthState({ userId: user.id, provider: "shopify", data: { shop } })

  const authUrl =
    `https://${shop}/admin/oauth/authorize?` +
    new URLSearchParams({
      client_id: id,
      scope: SHOPIFY_SCOPES,
      redirect_uri: redirectUri,
      state,
    }).toString()

  return NextResponse.redirect(authUrl)
}
