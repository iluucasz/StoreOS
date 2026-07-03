// Debug: roda cada query GAQL e mostra o erro detalhado.
import { config } from "dotenv"
config({ path: ".env.local" })

const version = process.env.GOOGLE_ADS_API_VERSION || "v20"
const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || "").replace(/\D/g, "")
const loginId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "").replace(/\D/g, "")

function dateRange(days, offset = 0) {
  const fmt = (d) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1 - offset)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return { start: fmt(start), end: fmt(end) }
}
const c = dateRange(7, 0)

const QUERIES = {
  "dashboard-daily": `SELECT segments.date, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.conversions_value FROM customer WHERE segments.date BETWEEN '${c.start}' AND '${c.end}' ORDER BY segments.date`,
  "dashboard-byCampaign": `SELECT campaign.name, metrics.cost_micros FROM campaign WHERE segments.date BETWEEN '${c.start}' AND '${c.end}' AND metrics.cost_micros > 0 ORDER BY metrics.cost_micros DESC LIMIT 8`,
  campaigns: `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.ctr, metrics.conversions, metrics.cost_per_conversion, metrics.conversions_value FROM campaign WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC`,
  keywords: `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, campaign.name, metrics.clicks, metrics.impressions, metrics.ctr, metrics.average_cpc, metrics.cost_micros, metrics.conversions FROM keyword_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 50`,
  "conversions-overview": `SELECT segments.conversion_action_name, segments.conversion_action_category, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date DURING LAST_30_DAYS AND metrics.conversions > 0`,
}

async function token() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  return (await res.json()).access_token
}

async function main() {
  const accessToken = await token()
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    "Content-Type": "application/json",
  }
  if (loginId) headers["login-customer-id"] = loginId

  for (const [name, query] of Object.entries(QUERIES)) {
    const res = await fetch(
      `https://googleads.googleapis.com/${version}/customers/${customerId}/googleAds:searchStream`,
      { method: "POST", headers, body: JSON.stringify({ query }) },
    )
    const text = await res.text()
    if (res.ok) {
      const json = JSON.parse(text)
      const rows = (Array.isArray(json) ? json : [json]).flatMap((b) => b.results ?? [])
      console.log(`\n✅ ${name}: OK (${rows.length} linhas)`)
    } else {
      const json = JSON.parse(text)
      const err = json?.[0]?.error?.details?.[0]?.errors?.[0] || json?.error
      console.log(`\n❌ ${name}: ${err?.message || "erro"}`)
      if (err?.location?.fieldPathElements) {
        console.log("   campo:", err.location.fieldPathElements.map((f) => f.fieldName).join(" > "))
      }
    }
  }
}

main().catch((e) => console.log("Erro:", e))
