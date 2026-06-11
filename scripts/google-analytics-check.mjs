// Diagnóstico rápido da conexão com a Google Analytics Data API (GA4).
// Uso: node scripts/google-analytics-check.mjs
import { config } from "dotenv"
config({ path: ".env.local" })

const clientId = process.env.GOOGLE_ANALYTICS_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID
const clientSecret = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET
const refreshToken = process.env.GOOGLE_ANALYTICS_REFRESH_TOKEN
const propertyId = (process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "").replace(/\D/g, "")

async function main() {
  if (!clientId || !clientSecret || !refreshToken || !propertyId) {
    console.log("❌ Faltam variáveis no .env.local:")
    console.log("   GOOGLE_ADS_CLIENT_ID/SECRET:", clientId ? "ok" : "FALTA")
    console.log("   GOOGLE_ANALYTICS_REFRESH_TOKEN:", refreshToken ? "ok" : "FALTA")
    console.log("   GOOGLE_ANALYTICS_PROPERTY_ID:", propertyId || "FALTA")
    return
  }

  console.log("1) Renovando access token...")
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    console.log("   ❌ Falha no OAuth:", JSON.stringify(tokenData))
    return
  }
  console.log("   ✅ Access token obtido.")

  console.log(`2) Consultando a propriedade ${propertyId}...`)
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "totalRevenue" }],
    }),
  })
  const text = await res.text()
  console.log("   HTTP", res.status)
  if (res.ok) {
    const json = JSON.parse(text)
    const row = json.rows?.[0]?.metricValues?.map((m) => m.value) ?? []
    console.log("   ✅ CONECTADO! (últimos 7 dias)")
    console.log(`      Usuários ativos: ${row[0] ?? 0} | Sessões: ${row[1] ?? 0} | Receita: ${row[2] ?? 0}`)
  } else {
    console.log("   ⚠️  A API respondeu com erro:")
    console.log("  ", text.slice(0, 1200))
  }
}

main().catch((e) => console.log("Erro inesperado:", e))
