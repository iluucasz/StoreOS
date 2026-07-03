"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, DollarSign, Package, TrendingUp, Loader2 } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ShopifyOrder {
  id: number
  name: string
  created_at: string
  total_price: string
  financial_status: string
  fulfillment_status: string | null
}

interface ShopifyProduct {
  id: number
  status: string
}

function Kpi({ title, value, icon: Icon, sub, loading }: { title: string; value: string; icon: LucideIcon; sub?: string; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ShopifyDashboard() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/shopify/orders").then((r) => r.json()),
      fetch("/api/shopify/products").then((r) => r.json()),
    ])
      .then(([ordersData, productsData]) => {
        if (!ordersData.error) setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders ?? [])
        if (!productsData.error) setProducts(Array.isArray(productsData) ? productsData : productsData.products ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toDateString()
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today)
  const todayRevenue = todayOrders.reduce((s, o) => s + parseFloat(o.total_price), 0)

  const pending = orders.filter((o) => o.financial_status === "pending" || (o.financial_status === "paid" && !o.fulfillment_status)).length
  const activeProducts = products.filter((p) => p.status === "active").length

  const allPaid = orders.filter((o) => o.financial_status === "paid")
  const avgTicket = allPaid.length > 0
    ? allPaid.reduce((s, o) => s + parseFloat(o.total_price), 0) / allPaid.length
    : 0

  // Last 7 days chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const salesData = days.map((d) => {
    const label = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")
    const dayStr = d.toDateString()
    const vendas = orders
      .filter((o) => new Date(o.created_at).toDateString() === dayStr)
      .reduce((s, o) => s + parseFloat(o.total_price), 0)
    return { day: label.charAt(0).toUpperCase() + label.slice(1), vendas }
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Kpi title="Vendas Hoje" value={formatCurrency(todayRevenue)} icon={DollarSign} sub={`${todayOrders.length} pedido${todayOrders.length !== 1 ? "s" : ""}`} loading={loading} />
        <Kpi title="Pedidos Pendentes" value={String(pending)} icon={ShoppingCart} sub="aguardando envio" loading={loading} />
        <Kpi title="Produtos Ativos" value={String(activeProducts)} icon={Package} sub="na loja" loading={loading} />
        <Kpi title="Ticket Médio" value={formatCurrency(avgTicket)} icon={TrendingUp} sub="pedidos pagos" loading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vendas — Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(v: number) => v === 0 ? "R$0" : `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0)), "Vendas"]} />
                <Bar dataKey="vendas" fill="#96bf48" radius={[4, 4, 0, 0]} name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
