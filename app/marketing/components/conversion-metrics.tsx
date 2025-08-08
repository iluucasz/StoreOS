"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { mockMarketingData } from "@/app/marketing/data/mock-data"
import { formatCurrency } from "@/lib/utils"
import { Calculator } from "lucide-react"

interface ConversionMetricsProps {
  isConnected: boolean
}

export function ConversionMetrics({ isConnected }: ConversionMetricsProps) {
  const { conversionData } = mockMarketingData

  // Estados para os parâmetros de conversão
  const [conversionRate, setConversionRate] = useState(2.5)
  const [averageOrderValue, setAverageOrderValue] = useState(150)
  const [customerAcquisitionCost, setCustomerAcquisitionCost] = useState(35)
  const [lifetimeValue, setLifetimeValue] = useState(450)

  // Calcular métricas derivadas
  const ltvCacRatio = lifetimeValue / customerAcquisitionCost
  const targetClicks = (100 / conversionRate) * 1 // Cliques necessários para 1 conversão
  const costPerClick = customerAcquisitionCost / targetClicks

  // Calcular projeções
  const projections = [
    {
      clicks: 100,
      spend: 100 * costPerClick,
      conversions: 100 * (conversionRate / 100),
      revenue: 100 * (conversionRate / 100) * averageOrderValue,
    },
    {
      clicks: 500,
      spend: 500 * costPerClick,
      conversions: 500 * (conversionRate / 100),
      revenue: 500 * (conversionRate / 100) * averageOrderValue,
    },
    {
      clicks: 1000,
      spend: 1000 * costPerClick,
      conversions: 1000 * (conversionRate / 100),
      revenue: 1000 * (conversionRate / 100) * averageOrderValue,
    },
    {
      clicks: 5000,
      spend: 5000 * costPerClick,
      conversions: 5000 * (conversionRate / 100),
      revenue: 5000 * (conversionRate / 100) * averageOrderValue,
    },
    {
      clicks: 10000,
      spend: 10000 * costPerClick,
      conversions: 10000 * (conversionRate / 100),
      revenue: 10000 * (conversionRate / 100) * averageOrderValue,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros de Conversão</CardTitle>
            <CardDescription>Configure os parâmetros de conversão para suas campanhas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conversion-rate">Taxa de Conversão (%)</Label>
              <Input
                id="conversion-rate"
                type="number"
                min="0.1"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Porcentagem de visitantes que realizam uma compra</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="average-order">Valor Médio do Pedido (R$)</Label>
              <Input
                id="average-order"
                type="number"
                min="1"
                value={averageOrderValue}
                onChange={(e) => setAverageOrderValue(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Valor médio gasto por cliente em cada compra</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cac">Custo de Aquisição de Cliente (R$)</Label>
              <Input
                id="cac"
                type="number"
                min="1"
                value={customerAcquisitionCost}
                onChange={(e) => setCustomerAcquisitionCost(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Custo médio para adquirir um novo cliente</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ltv">Lifetime Value - LTV (R$)</Label>
              <Input
                id="ltv"
                type="number"
                min="1"
                value={lifetimeValue}
                onChange={(e) => setLifetimeValue(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Valor total que um cliente gera durante seu relacionamento com a empresa
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Métricas
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Calculadas</CardTitle>
            <CardDescription>Métricas derivadas dos parâmetros de conversão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <MetricBox
                title="LTV:CAC Ratio"
                value={ltvCacRatio.toFixed(2)}
                description="Ideal > 3.0"
                status={ltvCacRatio >= 3 ? "good" : ltvCacRatio >= 2 ? "medium" : "bad"}
              />

              <MetricBox
                title="Cliques p/ Conversão"
                value={targetClicks.toFixed(0)}
                description={`${conversionRate}% de taxa`}
                status="neutral"
              />

              <MetricBox
                title="Custo por Clique"
                value={formatCurrency(costPerClick)}
                description="Estimado"
                status="neutral"
              />

              <MetricBox
                title="ROI Estimado"
                value={`${((averageOrderValue / customerAcquisitionCost - 1) * 100).toFixed(0)}%`}
                description="Por primeira compra"
                status={
                  averageOrderValue > customerAcquisitionCost * 2
                    ? "good"
                    : averageOrderValue > customerAcquisitionCost
                      ? "medium"
                      : "bad"
                }
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Projeção de Resultados</h3>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Cliques</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Gasto</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Conversões</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Receita</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projections.map((projection, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{projection.clicks.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(projection.spend)}</td>
                        <td className="px-4 py-2 text-sm">{projection.conversions.toFixed(0)}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(projection.revenue)}</td>
                        <td className="px-4 py-2 text-sm">
                          {((projection.revenue / projection.spend - 1) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Funil de Conversão</CardTitle>
          <CardDescription>Visualize o desempenho do seu funil de conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="funnel">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="funnel">Funil</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
              <TabsTrigger value="comparison">Comparação</TabsTrigger>
            </TabsList>
            <TabsContent value="funnel" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData.funnel} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="trends" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData.conversionTrend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" name="Taxa de Conversão (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="comparison" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData.platformComparison}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversionRate" fill="#8884d8" name="Taxa de Conversão (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricBoxProps {
  title: string
  value: string
  description: string
  status: "good" | "medium" | "bad" | "neutral"
}

function MetricBox({ title, value, description, status }: MetricBoxProps) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "medium":
        return "text-amber-600"
      case "bad":
        return "text-red-600"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="rounded-lg border p-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <p className={`text-xl font-bold mt-1 ${getStatusColor()}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
