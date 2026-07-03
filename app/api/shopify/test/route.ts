import { NextResponse } from "next/server"
import { getShopifyRequestCredentials } from "@/lib/integrations/shopify-request"
import { shopifyFetch, ShopifyError } from "@/lib/shopify"

export async function GET() {
  const credentials = await getShopifyRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ ok: false, configured: false, connected: false })
  }

  try {
    const data = await shopifyFetch<{ shop: any }>(credentials, "/shop.json")

    return NextResponse.json({
      ok: true,
      configured: true,
      connected: true,
      shop: data.shop.name,
      domain: data.shop.domain,
      myshopify_domain: data.shop.myshopify_domain,
      plan: data.shop.plan_name,
    })
  } catch (e) {
    const message = e instanceof ShopifyError ? e.message : "Erro ao conectar à Shopify"
    return NextResponse.json({ ok: false, configured: true, connected: false, error: message }, { status: 502 })
  }
}
