"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, Package, DollarSign, Sparkles } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useProducts } from "@/contexts/products-context"
import { formatCurrency } from "@/lib/utils"

interface ShopifyOrder {
  id: number
  created_at: string
  total_price: string
  financial_status: string
  fulfillment_status: string | null
}

export function DashboardPage() {
  const { getTotalProducts, getNewProducts } = useProducts()
  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    fetch("/api/shopify/orders")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data) })
      .finally(() => setOrdersLoading(false))
  }, [])

  const marketingData = [
    { date: "01/05", receita: 1200, lucro: 880, meta: 120, google: 60 },
    { date: "03/05", receita: 1500, lucro: 1100, meta: 150, google: 70 },
    { date: "05/05", receita: 1350, lucro: 990, meta: 130, google: 65 },
    { date: "07/05", receita: 1800, lucro: 1320, meta: 180, google: 90 },
    { date: "09/05", receita: 2100, lucro: 1540, meta: 200, google: 110 },
    { date: "11/05", receita: 1900, lucro: 1390, meta: 175, google: 95 },
    { date: "13/05", receita: 2300, lucro: 1690, meta: 230, google: 120 },
    { date: "15/05", receita: 2500, lucro: 1830, meta: 240, google: 130 },
  ]

  const paidOrders = orders.filter((o) => o.financial_status === "paid" || o.financial_status === "partially_paid")
  const totalReceita = paidOrders.reduce((s, o) => s + parseFloat(o.total_price), 0)
  const pendingCount = orders.filter((o) => o.financial_status === "pending").length
  const today = new Date().toDateString()
  const todayCount = orders.filter((o) => new Date(o.created_at).toDateString() === today).length

  const recentProducts = getNewProducts(30).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Uma única tela para gerenciar sua loja</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersLoading ? "—" : formatCurrency(totalReceita)}</div>
            <p className="text-xs text-muted-foreground">{ordersLoading ? "" : `${paidOrders.length} pedidos pagos`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersLoading ? "—" : todayCount}</div>
            <p className="text-xs text-muted-foreground">{ordersLoading ? "" : `${pendingCount} pendentes`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5x</div>
            <p className="text-xs text-emerald-600">+5.1% vs mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalProducts()}</div>
            <p className="text-xs text-muted-foreground">+{getNewProducts(30).length} novos este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Lucro</CardTitle>
            <CardDescription>Últimos 15 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketingData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                  <Line type="monotone" dataKey="receita" stroke="#3b82f6" name="Receita" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="lucro" stroke="#10b981" name="Lucro" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gasto por Canal</CardTitle>
            <CardDescription>Meta Ads vs Google Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketingData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                  <Bar dataKey="meta" fill="#3b82f6" name="Meta Ads" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="google" fill="#f97316" name="Google Ads" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Precificação
            </CardTitle>
            <CardDescription>
              Calcule preços e simule cenários em uma única tela
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Custo do produto, frete, impostos, margem — o preço ideal calculado automaticamente.
            </p>
            <Button asChild className="w-full">
              <Link href="/calculator">
                Acessar Precificação
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Financeiro
            </CardTitle>
            <CardDescription>Receita, CAC, ROAS e margem consolidados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Conecte Meta Ads, Google Ads e sua loja para ver o lucro real em um lugar só.
            </p>
            <Button asChild className="w-full">
              <Link href="/reports">
                Acessar Financeiro
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              IA
            </CardTitle>
            <CardDescription>Pergunte sobre sua loja</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              "Por que as vendas caíram?" — a IA analisa GA4, Meta e pedidos e responde.
            </p>
            <Button asChild className="w-full">
              <Link href="/ia">
                Perguntar à IA
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Produtos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <li key={product.id} className="flex justify-between items-center text-sm">
                  <span>{product.name}</span>
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Nenhum produto adicionado recentemente</li>
            )}
          </ul>
          <Button variant="outline" asChild className="w-full mt-4">
            <Link href="/products">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
