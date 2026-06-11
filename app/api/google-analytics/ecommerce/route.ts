import { NextResponse } from "next/server"
import { isConfigured, runReport, parseRows, firstRow, num, gaDate, pct, GoogleAnalyticsError } from "@/lib/google-analytics"

/** E-commerce: receita, pedidos, categorias e produtos (14/30 dias). */
export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false })
  }

  const totalsMetrics = [
    { name: "purchaseRevenue" },
    { name: "ecommercePurchases" },
    { name: "itemsPurchased" },
  ]

  try {
    const [curr, prev, daily, categories, products] = await Promise.all([
      runReport({ dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }], metrics: totalsMetrics }),
      runReport({ dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }], metrics: totalsMetrics }),
      runReport({
        dateRanges: [{ startDate: "14daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "purchaseRevenue" }, { name: "ecommercePurchases" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "itemCategory" }],
        metrics: [{ name: "itemRevenue" }],
        orderBys: [{ desc: true, metric: { metricName: "itemRevenue" } }],
        limit: 8,
      }),
      runReport({
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "itemName" }],
        metrics: [{ name: "itemsPurchased" }, { name: "itemRevenue" }],
        orderBys: [{ desc: true, metric: { metricName: "itemRevenue" } }],
        limit: 10,
      }),
    ])

    const c = firstRow(curr)
    const p = firstRow(prev)

    const revenue = num(c.purchaseRevenue)
    const orders = num(c.ecommercePurchases)
    const items = num(c.itemsPurchased)
    const aov = orders ? revenue / orders : 0

    const pRevenue = num(p.purchaseRevenue)
    const pOrders = num(p.ecommercePurchases)
    const pItems = num(p.itemsPurchased)
    const pAov = pOrders ? pRevenue / pOrders : 0

    const revenueData = parseRows(daily).map((r) => ({
      date: gaDate(r.date),
      revenue: Math.round(num(r.purchaseRevenue) * 100) / 100,
      orders: num(r.ecommercePurchases),
    }))

    const categoryPerformanceData = parseRows(categories)
      .filter((r) => r.itemCategory && r.itemCategory !== "(not set)")
      .map((r) => ({ category: r.itemCategory, revenue: Math.round(num(r.itemRevenue)) }))

    const productPerformanceData = parseRows(products)
      .filter((r) => r.itemName && r.itemName !== "(not set)")
      .map((r) => {
        const quantity = num(r.itemsPurchased)
        const rev = num(r.itemRevenue)
        return {
          product: r.itemName,
          quantity: Math.round(quantity),
          revenue: Math.round(rev),
          avgPrice: quantity ? rev / quantity : 0,
        }
      })

    return NextResponse.json({
      configured: true,
      totals: {
        revenue,
        orders,
        aov,
        items,
        revenueDelta: pct(revenue, pRevenue),
        ordersDelta: pct(orders, pOrders),
        aovDelta: pct(aov, pAov),
        itemsDelta: pct(items, pItems),
      },
      revenueData,
      categoryPerformanceData,
      productPerformanceData,
    })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar dados de e-commerce"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
