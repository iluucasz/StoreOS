import { NextResponse } from "next/server"

const SHOP = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!
const BASE = `https://${SHOP}/admin/api/2025-01`

export async function GET() {
  const res = await fetch(
    `${BASE}/products.json?limit=50&fields=id,title,status,variants`,
    { headers: { "X-Shopify-Access-Token": TOKEN }, next: { revalidate: 60 } }
  )
  if (!res.ok) return NextResponse.json({ error: "Shopify error", status: res.status }, { status: 502 })
  const data = await res.json()
  return NextResponse.json(data.products)
}
