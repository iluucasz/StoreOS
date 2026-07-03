import { createHmac, timingSafeEqual } from "crypto"
import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { verifyOAuthState } from "@/lib/integrations/oauth-state"
import { saveUserIntegration } from "@/lib/integrations/store"
import { clientId, clientSecret, normalizeShopDomain } from "@/lib/shopify"

function redirectWithMessage(origin: string, type: "connected" | "error", message: string) {
  const url = new URL("/integrations/shopify", origin)
  url.searchParams.set(type, message)
  return NextResponse.redirect(url)
}

function verifyShopifyHmac(searchParams: URLSearchParams): boolean {
  const secret = clientSecret()
  const hmac = searchParams.get("hmac")
  if (!secret || !hmac) return false

  const params = new URLSearchParams(searchParams)
  params.delete("hmac")
  params.delete("signature")
  const message = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const expected = createHmac("sha256", secret).update(message).digest("hex")
  const left = Buffer.from(hmac, "hex")
  const right = Buffer.from(expected, "hex")
  return left.length === right.length && timingSafeEqual(left, right)
}

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const shop = normalizeShopDomain(searchParams.get("shop"))
  const state = verifyOAuthState(searchParams.get("state"), "shopify")

  if (!code || !shop) return redirectWithMessage(origin, "error", "Parâmetros inválidos no retorno da Shopify.")
  if (!state || state.userId !== user.id || state.data?.shop !== shop) {
    return redirectWithMessage(origin, "error", "Sessão de conexão inválida ou expirada. Tente novamente.")
  }
  if (!verifyShopifyHmac(searchParams)) {
    return redirectWithMessage(origin, "error", "Assinatura da Shopify inválida.")
  }

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId(),
      client_secret: clientSecret(),
      code,
    }),
  })

  const data = await tokenRes.json().catch(() => ({}))
  if (!data.access_token) {
    return redirectWithMessage(origin, "error", "Falha ao obter token da Shopify.")
  }

  let accountName = shop
  try {
    const shopRes = await fetch(`https://${shop}/admin/api/2025-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": data.access_token },
      cache: "no-store",
    })
    const shopData = await shopRes.json().catch(() => ({}))
    accountName = shopData.shop?.name || shop
  } catch {
    accountName = shop
  }

  await saveUserIntegration({
    userId: user.id,
    provider: "shopify",
    providerAccountId: shop,
    accountName,
    accessToken: data.access_token,
    scope: data.scope,
    metadata: { shop },
  })

  return redirectWithMessage(origin, "connected", "shopify")
}
