import { type NextRequest, NextResponse } from "next/server"
import { getShopifyRequestCredentials } from "@/lib/integrations/shopify-request"

type Level = "critico" | "baixo" | "ok" | "alto"

function levelFor(stock: number, minStock: number): Level {
  if (stock <= minStock * 0.5) return "critico"
  if (stock <= minStock) return "baixo"
  if (stock <= minStock * 4) return "ok"
  return "alto"
}

export async function GET(request: NextRequest) {
  const minStock = Number(new URL(request.url).searchParams.get("minStock")) || 5
  const credentials = await getShopifyRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false, items: [] })
  }

  const base = `https://${credentials.shop}/admin/api/2025-01`
  const headers = { "X-Shopify-Access-Token": credentials.accessToken }

  try {
    const productsResponse = await fetch(`${base}/products.json?limit=250&fields=id,title,status,product_type,variants`, {
      headers,
      cache: "no-store",
    })

    if (!productsResponse.ok) {
      return NextResponse.json(
        { configured: true, error: `Shopify retornou erro ${productsResponse.status} ao buscar produtos.` },
        { status: 502 },
      )
    }

    const products: any[] = (await productsResponse.json()).products || []
    const inventoryIds = [
      ...new Set(products.flatMap((product) => (product.variants || []).map((variant: any) => variant.inventory_item_id)).filter(Boolean)),
    ]
    const costMap = new Map<number, number>()

    for (let index = 0; index < inventoryIds.length; index += 250) {
      const chunk = inventoryIds.slice(index, index + 250)
      const inventoryResponse = await fetch(`${base}/inventory_items.json?ids=${chunk.join(",")}&limit=250`, {
        headers,
        cache: "no-store",
      })

      if (inventoryResponse.ok) {
        const inventoryItems: any[] = (await inventoryResponse.json()).inventory_items || []
        for (const item of inventoryItems) costMap.set(item.id, Number(item.cost || 0))
      }
    }

    const since = new Date()
    since.setDate(since.getDate() - 30)
    const ordersResponse = await fetch(
      `${base}/orders.json?status=any&limit=250&created_at_min=${since.toISOString()}&fields=created_at,line_items`,
      { headers, cache: "no-store" },
    )

    const orders: any[] = ordersResponse.ok ? (await ordersResponse.json()).orders || [] : []
    const salesByProduct = new Map<number, { units: number; revenue: number }>()

    for (const order of orders) {
      for (const lineItem of order.line_items || []) {
        if (!lineItem.product_id) continue
        const current = salesByProduct.get(lineItem.product_id) || { units: 0, revenue: 0 }
        current.units += Number(lineItem.quantity || 0)
        current.revenue += Number(lineItem.quantity || 0) * Number(lineItem.price || 0)
        salesByProduct.set(lineItem.product_id, current)
      }
    }

    const items = products.map((product) => {
      const variants: any[] = product.variants || []
      const stock = variants.reduce((sum, variant) => sum + Math.max(0, Number(variant.inventory_quantity || 0)), 0)
      const totalCost = variants.reduce(
        (sum, variant) => sum + Math.max(0, Number(variant.inventory_quantity || 0)) * (costMap.get(variant.inventory_item_id) || 0),
        0,
      )
      const unitCost = stock > 0 ? totalCost / stock : costMap.get(variants[0]?.inventory_item_id) || 0
      const price = Number(variants[0]?.price || 0)
      const sales = salesByProduct.get(product.id) || { units: 0, revenue: 0 }
      const monthlySales = sales.units
      const dailySales = monthlySales / 30

      return {
        id: String(product.id),
        name: product.title,
        sku: variants[0]?.sku || "-",
        category: product.product_type || "Sem categoria",
        stock,
        minStock,
        unitCost: Math.round(unitCost * 100) / 100,
        price,
        monthlySales,
        revenue: Math.round(sales.revenue * 100) / 100,
        level: levelFor(stock, minStock),
        abc: "C" as "A" | "B" | "C",
        daysToStockout: dailySales > 0 ? Math.round(stock / dailySales) : null,
      }
    })

    const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0) || 1
    let accumulatedRevenue = 0

    for (const item of [...items].sort((a, b) => b.revenue - a.revenue)) {
      accumulatedRevenue += item.revenue
      const percentage = accumulatedRevenue / totalRevenue
      item.abc = item.revenue === 0 ? "C" : percentage <= 0.8 ? "A" : percentage <= 0.95 ? "B" : "C"
    }

    return NextResponse.json({ configured: true, items })
  } catch (error) {
    console.error("Shopify inventory error:", error)
    return NextResponse.json({ configured: true, error: "Não foi possível buscar o inventário da Shopify." }, { status: 502 })
  }
}
