// Diagnóstico rápido da conexão com a Meta Marketing API.
// Uso: node scripts/meta-ads-check.mjs
import { config } from "dotenv"
config({ path: ".env.local" })

const token = process.env.META_ACCESS_TOKEN
const rawAcc = (process.env.META_AD_ACCOUNT_ID || "").trim()
const acc = rawAcc.startsWith("act_") ? rawAcc : `act_${rawAcc.replace(/\D/g, "")}`
const v = process.env.META_API_VERSION || "v21.0"

async function main() {
  if (!token || !rawAcc) {
    console.log("❌ Faltam variáveis no .env.local:")
    console.log("   META_ACCESS_TOKEN:", token ? "ok" : "FALTA")
    console.log("   META_AD_ACCOUNT_ID:", rawAcc || "FALTA")
    return
  }

  console.log(`1) Consultando a conta ${acc}...`)
  const infoRes = await fetch(
    `https://graph.facebook.com/${v}/${acc}?fields=name,currency,account_status&access_token=${token}`,
  )
  const info = await infoRes.json()
  if (info.error) {
    console.log("   ⚠️  Erro:", info.error.message)
    return
  }
  console.log(`   ✅ CONECTADO! Conta: ${info.name} (${info.currency}), status ${info.account_status}`)

  console.log("2) Buscando gasto dos últimos 7 dias...")
  const insRes = await fetch(
    `https://graph.facebook.com/${v}/${acc}/insights?fields=spend,impressions,clicks&date_preset=last_7d&access_token=${token}`,
  )
  const ins = await insRes.json()
  if (ins.error) {
    console.log("   ⚠️  Erro nos insights:", ins.error.message)
    return
  }
  const row = ins.data?.[0]
  if (row) console.log(`   ✅ Gasto: ${row.spend} | Impressões: ${row.impressions} | Cliques: ${row.clicks}`)
  else console.log("   ✅ Conexão OK, mas sem dados no período (conta sem gasto nos últimos 7 dias).")
}

main().catch((e) => console.log("Erro inesperado:", e))
