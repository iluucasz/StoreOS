// Lista as contas-cliente sob a MCC (para achar a conta de anúncios real).
import { config } from "dotenv"
config({ path: ".env.local" })

const version = process.env.GOOGLE_ADS_API_VERSION || "v20"
const managerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || "").replace(/\D/g, "")

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
  const res = await fetch(
    `https://googleads.googleapis.com/${version}/customers/${managerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        "login-customer-id": managerId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "SELECT customer_client.id, customer_client.descriptive_name, customer_client.manager, customer_client.level, customer_client.currency_code, customer_client.status FROM customer_client",
      }),
    },
  )
  const text = await res.text()
  if (!res.ok) {
    console.log("Erro:", text.slice(0, 800))
    return
  }
  const rows = JSON.parse(text).flatMap((b) => b.results ?? [])
  console.log(`Contas sob a MCC ${managerId}:\n`)
  for (const r of rows) {
    const c = r.customerClient
    console.log(
      `${c.manager ? "📁 MCC " : "🟢 CONTA"}  id=${c.id}  nível=${c.level}  moeda=${c.currencyCode || "-"}  status=${c.status || "-"}  nome="${c.descriptiveName || ""}"`,
    )
  }
}

main().catch((e) => console.log("Erro:", e))
