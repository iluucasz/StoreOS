// Lista TODAS as contas acessíveis pela conta Google autenticada.
import { config } from "dotenv"
config({ path: ".env.local" })

const version = process.env.GOOGLE_ADS_API_VERSION || "v20"

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
  const res = await fetch(`https://googleads.googleapis.com/${version}/customers:listAccessibleCustomers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    },
  })
  const data = await res.json()
  if (!res.ok) {
    console.log("Erro:", JSON.stringify(data).slice(0, 800))
    return
  }
  console.log("Contas acessíveis (resourceNames):")
  console.log(data.resourceNames || data)
}

main().catch((e) => console.log("Erro:", e))
