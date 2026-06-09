import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const shop = searchParams.get("shop")

  if (!code || !shop) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
  }

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })

  const data = await tokenRes.json()

  if (!data.access_token) {
    return NextResponse.json({ error: "Falha ao obter token", detail: data }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    instrucao: "Copie o access_token abaixo e adicione no seu .env.local como SHOPIFY_ACCESS_TOKEN",
    access_token: data.access_token,
    shop,
  })
}
