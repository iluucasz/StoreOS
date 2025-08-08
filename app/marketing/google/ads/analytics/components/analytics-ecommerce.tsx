"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, BarChart2, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const revenueData = [
  { date: "01/07", revenue: 1200, orders: 25 },
  { date: "02/07", revenue: 1350, orders: 28 },
  { date: "03/07", revenue: 1500, orders: 32 },
  { date: "04/07", revenue: 1400, orders: 30 },
  { date: "05/07", revenue: 1650, orders: 35 },
  { date: "06/07", revenue: 1800, orders: 38 },
  { date: "07/07", revenue: 1700, orders: 36 },
  { date: "08/07", revenue: 1900, orders: 40 },
  { date: "09/07", revenue: 2000, orders: 42 },
  { date: "10/07", revenue: 2150, orders: 45 },
  { date: "11/07", revenue: 2300, orders: 48 },
  { date: "12/07", revenue: 2200, orders: 46 },
  { date: "13/07", revenue: 2400, orders: 50 },
  { date: "14/07", revenue: 2500, orders: 52 },
]

const topProductsData = [
  { product: "Smartphone XYZ", quantity: 120, revenue: 72000, avgPrice: 600 },
  { product: "Laptop Pro", quantity: 85, revenue: 127500, avgPrice: 1500 },
  { product: "Wireless Headphones", quantity: 210, revenue: 31500, avgPrice: 150 },
  { product: "Smart Watch", quantity: 150, revenue: 37500, avgPrice: 250 },
  { product: "Tablet Ultra", quantity: 95, revenue: 47500, avgPrice: 500 },
  { product: "Bluetooth Speaker", quantity: 180, revenue: 18000, avgPrice: 100 },
  { product: "Gaming Console", quantity: 65, revenue: 32500, avgPrice: 500 },
]

interface AnalyticsEcommerceProps {
  isConnected: boolean
}

export function AnalyticsEcommerce({ isConnected }: AnalyticsEcommerceProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre e-commerce.
        </p>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          Conectar ao Google Analytics
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 366,800</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +18.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">905</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio do Pedido</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 405.30</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +5.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +0.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita e Pedidos</CardTitle>
          <CardDescription>Receita e número de pedidos nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Receita (R$)"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Pedidos"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Desempenho dos produtos mais vendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Receita (R$)</TableHead>
                <TableHead className="text-right">Preço Médio (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProductsData.map((row) => (
                <TableRow key={row.product}>
                  <TableCell className="font-medium">{row.product}</TableCell>
                  <TableCell className="text-right">{row.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.avgPrice.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
