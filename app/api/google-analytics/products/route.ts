import { NextResponse } from "next/server"
import { runReport, parseRows, num, GoogleAnalyticsError } from "@/lib/google-analytics"
import { getGoogleAnalyticsRequestCredentials } from "@/lib/integrations/google-analytics-request"

/** Performance por produto (item) do GA4 nos últimos 30 dias. */
export async function GET() {
  const credentials = await getGoogleAnalyticsRequestCredentials()

  if (!credentials) {
    return NextResponse.json({ configured: false })
  }

  try {
    const resp = await runReport(
      {
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "itemName" }],
        metrics: [
          { name: "itemsViewed" },
          { name: "itemsAddedToCart" },
          { name: "itemsPurchased" },
          { name: "itemRevenue" },
        ],
        orderBys: [{ desc: true, metric: { metricName: "itemsViewed" } }],
        limit: 100,
      },
      credentials,
    )

    const items = parseRows(resp)
      .filter((r) => r.itemName && r.itemName !== "(not set)")
      .map((r) => {
        const views = num(r.itemsViewed)
        const cartAdds = num(r.itemsAddedToCart)
        const purchases = num(r.itemsPurchased)
        const revenue = num(r.itemRevenue)
        return {
          name: r.itemName,
          views,
          cartAdds,
          purchases,
          abandoned: Math.max(0, cartAdds - purchases),
          revenue: Math.round(revenue * 100) / 100,
          avgPrice: purchases ? revenue / purchases : 0,
        }
      })

    return NextResponse.json({ configured: true, items })
  } catch (e) {
    const message = e instanceof GoogleAnalyticsError ? e.message : "Erro ao buscar produtos do Analytics"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
