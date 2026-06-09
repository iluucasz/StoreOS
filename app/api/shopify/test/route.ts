import { NextResponse } from "next/server"

const SHOP = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!

export async function GET() {
  if (!SHOP || !TOKEN) {
    return NextResponse.json({ ok: false, error: "Credenciais não configuradas no servidor" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://${SHOP}/admin/api/2025-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": TOKEN },
    })

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Shopify retornou ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({
      ok: true,
      shop: data.shop.name,
      domain: data.shop.domain,
      myshopify_domain: data.shop.myshopify_domain,
      plan: data.shop.plan_name,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 502 })
  }
}
