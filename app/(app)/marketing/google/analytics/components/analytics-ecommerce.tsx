"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, ShoppingBag, DollarSign, Package, ShoppingCart } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useAnalyticsData, NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsEcommerceProps {
  isConnected: boolean
}

type EcommerceData = {
  totals: {
    revenue: number
    orders: number
    aov: number
    items: number
    revenueDelta: number
    ordersDelta: number
    aovDelta: number
    itemsDelta: number
  }
  revenueData: { date: string; revenue: number; orders: number }[]
  categoryPerformanceData: { category: string; revenue: number }[]
  productPerformanceData: { product: string; quantity: number; revenue: number; avgPrice: number }[]
}

function Delta({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={`flex items-center ${up ? "text-green-500" : "text-red-500"}`}>
      {value > 0 ? "+" : ""}
      {value}% {up ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
    </span>
  )
}

export function AnalyticsEcommerce({ isConnected }: AnalyticsEcommerceProps) {
  const { data, loading, error } = useAnalyticsData<EcommerceData>("/api/google-analytics/ecommerce", isConnected)

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, revenueData, categoryPerformanceData, productPerformanceData } = data

  const cards = [
    { title: "Receita Total", value: formatCurrency(totals.revenue), delta: totals.revenueDelta, icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    { title: "Pedidos", value: totals.orders.toLocaleString("pt-BR"), delta: totals.ordersDelta, icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" /> },
    { title: "Valor Médio do Pedido", value: formatCurrency(totals.aov), delta: totals.aovDelta, icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Produtos Vendidos", value: totals.items.toLocaleString("pt-BR"), delta: totals.itemsDelta, icon: <Package className="h-4 w-4 text-muted-foreground" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                <Delta value={card.delta} /> em relação ao período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita e Pedidos</CardTitle>
          <CardDescription>Desempenho de vendas nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Receita (R$)" stroke="#3B82F6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Pedidos" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Categoria</CardTitle>
            <CardDescription>Receita por categoria de produto (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryPerformanceData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados de categoria no período.</p>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformanceData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" name="Receita (R$)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Desempenho dos principais produtos (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {productPerformanceData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados de produtos no período.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd.</TableHead>
                    <TableHead className="text-right">Receita (R$)</TableHead>
                    <TableHead className="text-right">Preço Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformanceData.map((row) => (
                    <TableRow key={row.product}>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell className="text-right">{row.quantity.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="text-right">{row.revenue.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.avgPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
