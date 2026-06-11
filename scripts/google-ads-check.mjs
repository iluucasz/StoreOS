// Diagnóstico rápido da conexão com a Google Ads API.
// Uso: node scripts/google-ads-check.mjs
import { config } from "dotenv"
config({ path: ".env.local" })

const {
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_CUSTOMER_ID,
  GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  GOOGLE_ADS_API_VERSION,
} = process.env

const version = GOOGLE_ADS_API_VERSION || "v20"

async function main() {
  console.log("1) Renovando access token via refresh token...")
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_ADS_CLIENT_ID,
      client_secret: GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    console.log("   ❌ Falha no OAuth:", JSON.stringify(tokenData))
    return
  }
  console.log("   ✅ Access token obtido com sucesso.")

  const customerId = (GOOGLE_ADS_CUSTOMER_ID || "").replace(/\D/g, "")
  const loginId = (GOOGLE_ADS_LOGIN_CUSTOMER_ID || "").replace(/\D/g, "")
  console.log(`2) Consultando a conta ${customerId}${loginId ? ` (via MCC ${loginId})` : ""}...`)

  const headers = {
    Authorization: `Bearer ${tokenData.access_token}`,
    "developer-token": GOOGLE_ADS_DEVELOPER_TOKEN,
    "Content-Type": "application/json",
  }
  if (loginId) headers["login-customer-id"] = loginId

  const res = await fetch(
    `https://googleads.googleapis.com/${version}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query:
          "SELECT customer.id, customer.descriptive_name, customer.currency_code FROM customer LIMIT 1",
      }),
    },
  )
  const text = await res.text()
  console.log("   HTTP", res.status)
  if (res.ok) {
    console.log("   ✅ CONECTADO! Resposta:")
    console.log("  ", text.slice(0, 800))
  } else {
    console.log("   ⚠️  A API respondeu com erro:")
    console.log("  ", text.slice(0, 1500))
  }
}

main().catch((e) => console.log("Erro inesperado:", e))
