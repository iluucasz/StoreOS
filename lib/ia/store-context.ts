const SHOP = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!
const BASE = `https://${SHOP}/admin/api/2025-01`

export async function fetchStoreContext() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${BASE}/orders.json?status=any&limit=50&fields=id,name,created_at,total_price,financial_status,fulfillment_status,customer,line_items`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      }),
      fetch(`${BASE}/products.json?limit=50&fields=id,title,status,variants`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      }),
    ])

    const [{ orders = [] }, { products = [] }] = await Promise.all([
      ordersRes.json(),
      productsRes.json(),
    ])

    const paid = orders.filter((order: { financial_status: string }) => order.financial_status === "paid")
    const pending = orders.filter((order: { financial_status: string }) => order.financial_status === "pending")
    const cancelled = orders.filter((order: { financial_status: string }) =>
      ["refunded", "voided"].includes(order.financial_status)
    )
    const totalRevenue = paid.reduce((sum: number, order: { total_price: string }) => sum + parseFloat(order.total_price), 0)
    const avgTicket = paid.length > 0 ? totalRevenue / paid.length : 0

    const activeProducts = products.filter((product: { status: string }) => product.status === "active")
    const productLines = activeProducts.slice(0, 15).map((product: {
      title: string
      variants: { price: string; inventory_quantity: number }[]
    }) => {
      const stock = product.variants.reduce((sum: number, variant: { inventory_quantity: number }) => {
        return sum + (variant.inventory_quantity ?? 0)
      }, 0)
      const price = parseFloat(product.variants[0]?.price ?? "0")
      return `- ${product.title}: R$ ${price.toFixed(2)}, estoque ${stock} unid.`
    }).join("\n")

    const today = new Date().toDateString()
    const todayOrders = orders.filter((order: { created_at: string }) =>
      new Date(order.created_at).toDateString() === today
    )

    return `
DADOS REAIS DA LOJA (${SHOP}):
Data atual: ${new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

PEDIDOS:
- Total (ultimos 50): ${orders.length} pedidos
- Pagos: ${paid.length} | Pendentes: ${pending.length} | Cancelados: ${cancelled.length}
- Receita total (pagos): R$ ${totalRevenue.toFixed(2)}
- Ticket medio: R$ ${avgTicket.toFixed(2)}
- Pedidos hoje: ${todayOrders.length}

PRODUTOS (${activeProducts.length} ativos de ${products.length} total):
${productLines || "Nenhum produto ativo"}
`.trim()
  } catch {
    return "Dados da loja temporariamente indisponiveis."
  }
}
