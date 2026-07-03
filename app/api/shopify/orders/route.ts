import { NextResponse } from "next/server"
import { getShopifyRequestCredentials } from "@/lib/integrations/shopify-request"

export async function GET() {
  const credentials = await getShopifyRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, orders: [] })
  }

  try {
    const response = await fetch(
      `https://${credentials.shop}/admin/api/2025-01/orders.json?status=any&limit=50&fields=id,name,email,created_at,total_price,financial_status,fulfillment_status,customer,line_items,shipping_address,tracking_number`,
      { headers: { "X-Shopify-Access-Token": credentials.accessToken }, next: { revalidate: 60 } },
    )

    if (!response.ok) {
      return NextResponse.json(
        { configured: true, orders: [], error: `Shopify retornou erro ${response.status} ao buscar pedidos.` },
        { status: 502 },
      )
    }

    const data = await response.json()
    return NextResponse.json({ configured: true, orders: data.orders || [] })
  } catch (error) {
    console.error("Shopify orders error:", error)
    return NextResponse.json(
      { configured: true, orders: [], error: "Não foi possível buscar pedidos da Shopify." },
      { status: 502 },
    )
  }
}
