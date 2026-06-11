const SHOP = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN
const BASE = SHOP ? `https://${SHOP}/admin/api/2025-01` : ""

const DAY_MS = 24 * 60 * 60 * 1000
const ORDER_LIMIT = 100
const PRODUCT_LIMIT = 100

type ShopifyLineItem = {
  title?: string
  quantity?: number
  price?: string
}

type ShopifyOrder = {
  id: number | string
  name?: string
  created_at: string
  total_price?: string
  financial_status?: string
  fulfillment_status?: string | null
  line_items?: ShopifyLineItem[]
}

type ShopifyVariant = {
  price?: string
  inventory_quantity?: number | null
}

type ShopifyProduct = {
  id: number | string
  title: string
  status?: string
  variants?: ShopifyVariant[]
}

type PeriodSummary = {
  orders: ShopifyOrder[]
  paid: ShopifyOrder[]
  pending: ShopifyOrder[]
  cancelled: ShopifyOrder[]
  revenue: number
  avgTicket: number
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const integer = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
})

function toMoney(value: number) {
  return currency.format(Number.isFinite(value) ? value : 0)
}

function toNumber(value: string | number | undefined) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "0")
  return Number.isFinite(parsed) ? parsed : 0
}

function orderDate(order: ShopifyOrder) {
  return new Date(order.created_at)
}

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime())
}

function inRange(order: ShopifyOrder, start: Date, end: Date) {
  const date = orderDate(order)
  return isValidDate(date) && date >= start && date < end
}

function summarizeOrders(orders: ShopifyOrder[]): PeriodSummary {
  const paid = orders.filter((order) => order.financial_status === "paid")
  const pending = orders.filter((order) => order.financial_status === "pending")
  const cancelled = orders.filter((order) => ["refunded", "voided", "cancelled"].includes(order.financial_status ?? ""))
  const revenue = paid.reduce((sum, order) => sum + toNumber(order.total_price), 0)

  return {
    orders,
    paid,
    pending,
    cancelled,
    revenue,
    avgTicket: paid.length > 0 ? revenue / paid.length : 0,
  }
}

function periodSummary(orders: ShopifyOrder[], start: Date, end: Date) {
  return summarizeOrders(orders.filter((order) => inRange(order, start, end)))
}

function changeLabel(current: number, previous: number, formatter: (value: number) => string) {
  if (previous === 0) {
    if (current === 0) return `${formatter(current)} nos dois períodos`
    return `${formatter(current)} agora, sem base no período anterior`
  }

  const change = ((current - previous) / previous) * 100
  const prefix = change > 0 ? "+" : ""
  return `${formatter(current)} (${prefix}${change.toFixed(1)}% vs. período anterior)`
}

function formatDate(date: Date) {
  if (!isValidDate(date)) return "data indisponível"
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function daysSince(date: Date, now: Date) {
  if (!isValidDate(date)) return null
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY_MS))
}

function normalizeTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function productStock(product: ShopifyProduct) {
  return (product.variants ?? []).reduce((sum, variant) => sum + Math.max(0, variant.inventory_quantity ?? 0), 0)
}

function productPrice(product: ShopifyProduct) {
  return toNumber(product.variants?.[0]?.price)
}

function listLines<T>(items: T[], map: (item: T, index: number) => string, empty: string) {
  return items.length > 0 ? items.map(map).join("\n") : empty
}

function productSalesLines(orders: ShopifyOrder[], since: Date) {
  const sales = new Map<string, { title: string; quantity: number; revenue: number }>()

  for (const order of orders) {
    if (order.financial_status !== "paid" || !inRange(order, since, new Date(Date.now() + DAY_MS))) continue

    for (const item of order.line_items ?? []) {
      const title = item.title?.trim()
      if (!title) continue

      const key = normalizeTitle(title)
      const current = sales.get(key) ?? { title, quantity: 0, revenue: 0 }
      const quantity = item.quantity ?? 0
      current.quantity += quantity
      current.revenue += quantity * toNumber(item.price)
      sales.set(key, current)
    }
  }

  return [...sales.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
}

export async function fetchStoreContext() {
  if (!SHOP || !TOKEN) {
    return "Dados da loja indisponíveis: integração Shopify não configurada."
  }

  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(
        `${BASE}/orders.json?status=any&limit=${ORDER_LIMIT}&fields=id,name,created_at,total_price,financial_status,fulfillment_status,line_items`,
        {
          cache: "no-store",
          headers: { "X-Shopify-Access-Token": TOKEN },
        },
      ),
      fetch(`${BASE}/products.json?limit=${PRODUCT_LIMIT}&fields=id,title,status,variants`, {
        cache: "no-store",
        headers: { "X-Shopify-Access-Token": TOKEN },
      }),
    ])

    if (!ordersRes.ok || !productsRes.ok) {
      throw new Error("Shopify API indisponível")
    }

    const [{ orders = [] }, { products = [] }] = await Promise.all([
      ordersRes.json() as Promise<{ orders?: ShopifyOrder[] }>,
      productsRes.json() as Promise<{ products?: ShopifyProduct[] }>,
    ])

    const now = new Date()
    const last7Start = new Date(now.getTime() - 7 * DAY_MS)
    const previous7Start = new Date(now.getTime() - 14 * DAY_MS)
    const last30Start = new Date(now.getTime() - 30 * DAY_MS)
    const previous30Start = new Date(now.getTime() - 60 * DAY_MS)
    const tomorrow = new Date(now.getTime() + DAY_MS)

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const today = periodSummary(orders, todayStart, tomorrow)
    const last7 = periodSummary(orders, last7Start, tomorrow)
    const previous7 = periodSummary(orders, previous7Start, last7Start)
    const last30 = periodSummary(orders, last30Start, tomorrow)
    const previous30 = periodSummary(orders, previous30Start, last30Start)
    const all = summarizeOrders(orders)

    const latestPaidOrder = [...all.paid].sort((a, b) => orderDate(b).getTime() - orderDate(a).getTime())[0]
    const latestPaidDate = latestPaidOrder ? orderDate(latestPaidOrder) : null
    const latestPaidDays = latestPaidDate ? daysSince(latestPaidDate, now) : null

    const activeProducts = products.filter((product) => product.status === "active")
    const productRows = activeProducts
      .map((product) => ({
        title: product.title,
        stock: productStock(product),
        price: productPrice(product),
      }))
      .sort((a, b) => b.stock - a.stock || a.title.localeCompare(b.title))

    const topStock = productRows.slice(0, 8)
    const lowStock = productRows.filter((product) => product.stock > 0 && product.stock <= 3).slice(0, 8)
    const outOfStock = productRows.filter((product) => product.stock === 0).slice(0, 8)
    const totalStock = productRows.reduce((sum, product) => sum + product.stock, 0)

    const salesLast30 = productSalesLines(orders, last30Start)
    const soldTitlesLast30 = new Set(salesLast30.map((item) => normalizeTitle(item.title)))
    const highStockWithoutRecentSales = productRows
      .filter((product) => product.stock >= 5 && !soldTitlesLast30.has(normalizeTitle(product.title)))
      .slice(0, 8)

    const diagnostics: string[] = []
    if (last7.paid.length === 0) diagnostics.push("Nenhum pedido pago nos últimos 7 dias.")
    if (previous7.paid.length > 0 && last7.revenue < previous7.revenue) {
      diagnostics.push(`Receita dos últimos 7 dias caiu para ${toMoney(last7.revenue)} contra ${toMoney(previous7.revenue)} no período anterior.`)
    }
    if (last30.pending.length > last30.paid.length && last30.pending.length > 0) {
      diagnostics.push("Há mais pedidos pendentes do que pagos nos últimos 30 dias; pode existir gargalo de pagamento ou checkout.")
    }
    if (outOfStock.length > 0) diagnostics.push(`${outOfStock.length} produto(s) ativo(s) sem estoque na amostra analisada.`)
    if (highStockWithoutRecentSales.length > 0) {
      diagnostics.push(`${highStockWithoutRecentSales.length} produto(s) com estoque relevante e sem venda recente nos últimos 30 dias.`)
    }
    if (diagnostics.length === 0) diagnostics.push("Nenhum gargalo evidente foi detectado apenas pelos dados de pedidos e estoque.")

    return `
DADOS REAIS DA LOJA (${SHOP}):
Data atual: ${now.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Amostra analisada: últimos ${orders.length} pedidos e até ${products.length} produtos da Shopify.

RESUMO DE VENDAS:
- Hoje: ${today.paid.length} pedido(s) pago(s), ${toMoney(today.revenue)} em receita, ticket médio ${toMoney(today.avgTicket)}.
- Últimos 7 dias: ${last7.paid.length} pedido(s) pago(s), ${changeLabel(last7.revenue, previous7.revenue, toMoney)}, ticket médio ${toMoney(last7.avgTicket)}.
- 7 dias anteriores: ${previous7.paid.length} pedido(s) pago(s), ${toMoney(previous7.revenue)} em receita.
- Últimos 30 dias: ${last30.paid.length} pedido(s) pago(s), ${changeLabel(last30.revenue, previous30.revenue, toMoney)}, ticket médio ${toMoney(last30.avgTicket)}.
- Último pedido pago: ${latestPaidOrder ? `${latestPaidOrder.name ?? latestPaidOrder.id} em ${formatDate(latestPaidDate!)} (${latestPaidDays} dia(s) atrás)` : "nenhum pedido pago encontrado na amostra"}.

STATUS DOS PEDIDOS:
- Amostra total: ${orders.length} pedido(s) | pagos: ${all.paid.length} | pendentes: ${all.pending.length} | cancelados/reembolsados: ${all.cancelled.length}.
- Últimos 30 dias: pagos ${last30.paid.length}, pendentes ${last30.pending.length}, cancelados/reembolsados ${last30.cancelled.length}.

DIAGNÓSTICOS AUTOMÁTICOS:
${diagnostics.map((item) => `- ${item}`).join("\n")}

PRODUTOS E ESTOQUE:
- Produtos ativos: ${activeProducts.length} de ${products.length} produto(s) analisados.
- Estoque total estimado nos produtos ativos: ${integer.format(totalStock)} unidade(s).
- Produtos sem estoque: ${outOfStock.length}; produtos com estoque baixo (1 a 3 unid.): ${lowStock.length}.
- Maiores estoques:
${listLines(topStock, (product) => `  - ${product.title}: ${product.stock} unid., preço ${toMoney(product.price)}`, "  - Nenhum produto ativo encontrado.")}
- Baixo estoque:
${listLines(lowStock, (product) => `  - ${product.title}: ${product.stock} unid.`, "  - Nenhum produto com estoque baixo na amostra.")}

VENDAS POR PRODUTO NOS ÚLTIMOS 30 DIAS:
- Mais vendidos:
${listLines(salesLast30.slice(0, 8), (item) => `  - ${item.title}: ${item.quantity} unid., ${toMoney(item.revenue)} em receita`, "  - Nenhum produto vendido nos últimos 30 dias na amostra.")}
- Produtos com estoque relevante e sem venda recente:
${listLines(highStockWithoutRecentSales, (product) => `  - ${product.title}: ${product.stock} unid., preço ${toMoney(product.price)}`, "  - Nenhum produto com estoque parado evidente na amostra.")}
`.trim()
  } catch {
    return "Dados da loja temporariamente indisponíveis."
  }
}
