// Confere o inventário real da Shopify (mesma lógica da rota).
import { config } from "dotenv"
config({ path: ".env.local" })

const SHOP = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN
const BASE = `https://${SHOP}/admin/api/2025-01`
const H = { "X-Shopify-Access-Token": TOKEN }

async function main() {
  const pr = await fetch(`${BASE}/products.json?limit=250&fields=id,title,status,product_type,variants`, { headers: H })
  if (!pr.ok) {
    console.log("❌ Erro produtos:", pr.status, await pr.text())
    return
  }
  const products = (await pr.json()).products || []
  console.log(`✅ ${products.length} produtos na Shopify\n`)

  let totalStock = 0
  const sample = products.slice(0, 8).map((p) => {
    const stock = (p.variants || []).reduce((s, v) => s + Math.max(0, Number(v.inventory_quantity || 0)), 0)
    totalStock += stock
    return `  • ${p.title} — estoque ${stock} (${(p.variants || []).length} variante(s), ${p.product_type || "sem categoria"})`
  })
  products.slice(8).forEach((p) => {
    totalStock += (p.variants || []).reduce((s, v) => s + Math.max(0, Number(v.inventory_quantity || 0)), 0)
  })
  console.log(sample.join("\n"))
  console.log(`\nEstoque total (todos os produtos): ${totalStock} unidades`)
}

main().catch((e) => console.log("Erro:", e))
