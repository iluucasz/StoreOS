import { NextResponse } from "next/server"
import { getShopifyRequestCredentials } from "@/lib/integrations/shopify-request"

export async function GET() {
  const credentials = await getShopifyRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, products: [] })
  }

  try {
    const response = await fetch(`https://${credentials.shop}/admin/api/2025-01/products.json?limit=50&fields=id,title,status,variants`, {
      headers: { "X-Shopify-Access-Token": credentials.accessToken },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { configured: true, products: [], error: `Shopify retornou erro ${response.status} ao buscar produtos.` },
        { status: 502 },
      )
    }

    const data = await response.json()
    return NextResponse.json({ configured: true, products: data.products || [] })
  } catch (error) {
    console.error("Shopify products error:", error)
    return NextResponse.json(
      { configured: true, products: [], error: "Não foi possível buscar produtos da Shopify." },
      { status: 502 },
    )
  }
}
