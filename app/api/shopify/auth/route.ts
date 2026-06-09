import { NextResponse } from "next/server"

export async function GET() {
  const shop = process.env.SHOPIFY_STORE_DOMAIN!
  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const scopes = "read_customers,read_inventory,read_orders,read_products"
  const redirectUri = "http://localhost:3000/api/shopify/callback"
  const state = Math.random().toString(36).substring(2)

  const authUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  return NextResponse.redirect(authUrl)
}
