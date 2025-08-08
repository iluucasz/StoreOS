"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, BarChart2, TrendingUp, ArrowUpRight, ShoppingCart } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const conversionTrendsData = [
  { date: "01/07", conversions: 25, conversionRate: 2.5 },
  { date: "02/07", conversions: 28, conversionRate: 2.7 },
  { date: "03/07", conversions: 32, conversionRate: 2.9 },
  { date: "04/07", conversions: 30, conversionRate: 2.8 },
  { date: "05/07", conversions: 35, conversionRate: 3.0 },
  { date: "06/07", conversions: 38, conversionRate: 3.2 },
  { date: "07/07", conversions: 36, conversionRate: 3.1 },
  { date: "08/07", conversions: 40, conversionRate: 3.3 },
  { date: "09/07", conversions: 42, conversionRate: 3.4 },
  { date: "10/07", conversions: 45, conversionRate: 3.5 },
  { date: "11/07", conversions: 48, conversionRate: 3.6 },
  { date: "12/07", conversions: 46, conversionRate: 3.5 },
  { date: "13/07", conversions: 50, conversionRate: 3.7 },
  { date: "14/07", conversions: 52, conversionRate: 3.8 },
]

const goalCompletionsData = [
  { goal: "Compra Concluída", completions: 320, value: 15800, conversionRate: 3.2 },
  { goal: "Cadastro Newsletter", completions: 580, value: 2900, conversionRate: 5.8 },
  { goal: "Download E-book", completions: 420, value: 2100, conversionRate: 4.2 },
  { goal: "Formulário de Contato", completions: 280, value: 1400, conversionRate: 2.8 },
  { goal: "Demonstração Agendada", completions: 150, value: 7500, conversionRate: 1.5 },
  { goal: "Carrinho Abandonado", completions: 480, value: 0, conversionRate: 4.8 },
]

interface AnalyticsConversionsProps {
  isConnected: boolean
}

export function AnalyticsConversions({ isConnected }: AnalyticsConversionsProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre conversões e objetivos.
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
            <CardTitle className="text-sm font-medium">Total de Conversões</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,230</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +15.3% <ArrowUpRight className="h-3 w-3 ml-1" />
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Conversão</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 29,700</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.8% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 133.18</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                -2.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendências de Conversão</CardTitle>
          <CardDescription>Conversões e taxa de conversão nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionTrendsData}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="conversions"
                  name="Conversões"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  name="Taxa de Conversão (%)"
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
          <CardTitle>Objetivos e Conversões</CardTitle>
          <CardDescription>Desempenho dos objetivos configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Objetivo</TableHead>
                <TableHead className="text-right">Conclusões</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead className="text-right">Taxa de Conversão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goalCompletionsData.map((row) => (
                <TableRow key={row.goal}>
                  <TableCell className="font-medium">{row.goal}</TableCell>
                  <TableCell className="text-right">{row.completions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.conversionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
