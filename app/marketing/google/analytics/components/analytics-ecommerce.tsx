"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, ArrowUpRight, ShoppingBag, DollarSign, Package, ShoppingCart } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const revenueData = [
  { date: "01/07", revenue: 1250, orders: 25 },
  { date: "02/07", revenue: 1400, orders: 28 },
  { date: "03/07", revenue: 1600, orders: 32 },
  { date: "04/07", revenue: 1500, orders: 30 },
  { date: "05/07", revenue: 1750, orders: 35 },
  { date: "06/07", revenue: 1900, orders: 38 },
  { date: "07/07", revenue: 1800, orders: 36 },
  { date: "08/07", revenue: 2000, orders: 40 },
  { date: "09/07", revenue: 2100, orders: 42 },
  { date: "10/07", revenue: 2250, orders: 45 },
  { date: "11/07", revenue: 2400, orders: 48 },
  { date: "12/07", revenue: 2300, orders: 46 },
  { date: "13/07", revenue: 2500, orders: 50 },
  { date: "14/07", revenue: 2600, orders: 52 },
]

const productPerformanceData = [
  { product: "Camiseta Premium", quantity: 120, revenue: 5980, avgPrice: 49.9 },
  { product: "Tênis Esportivo", quantity: 85, revenue: 12750, avgPrice: 149.9 },
  { product: "Mochila Resistente", quantity: 65, revenue: 6490, avgPrice: 99.9 },
  { product: "Relógio Inteligente", quantity: 45, revenue: 8990, avgPrice: 199.9 },
  { product: "Fone de Ouvido Bluetooth", quantity: 95, revenue: 5690, avgPrice: 59.9 },
  { product: "Notebook Ultrafino", quantity: 25, revenue: 37490, avgPrice: 1499.9 },
]

const categoryPerformanceData = [
  { category: "Vestuário", revenue: 15800 },
  { category: "Eletrônicos", revenue: 52100 },
  { category: "Acessórios", revenue: 12400 },
  { category: "Calçados", revenue: 18900 },
  { category: "Casa", revenue: 8700 },
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
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre seu e-commerce.
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
            <div className="text-2xl font-bold">R$ 77,690</div>
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
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">435</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +8.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio do Pedido</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 178.60</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +3.8% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +10.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Categoria</CardTitle>
            <CardDescription>Receita por categoria de produto</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Desempenho dos principais produtos</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="text-right">{row.quantity}</TableCell>
                    <TableCell className="text-right">{row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">R$ {row.avgPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
