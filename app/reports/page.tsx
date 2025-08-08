"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DownloadIcon, BarChart, LineChart, PieChart } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useProducts } from "@/contexts/products-context"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("last_6_months")
  const { products } = useProducts()

  // Mock data for marketing metrics
  const mockMarketingData = {
    performanceData: Array.from({ length: 15 }, (_, i) => ({
      date: `${String(i + 1).padStart(2, "0")}/05`,
      spend: 100 + Math.floor(Math.random() * 150),
      conversions: 5 + Math.floor(Math.random() * 20),
    })),
    campaignMetrics: {
      totalSpend: 2500,
      conversions: 200,
      spendChange: 15,
      conversionChange: 20,
      averageCPA: 12.5,
      cpaChange: -5,
      roas: 3.5,
      roasChange: 10,
    },
    spendByPlatform: [
      { name: "Facebook", value: 1200 },
      { name: "Instagram", value: 800 },
      { name: "Google", value: 500 },
    ],
  }

  // Converter período selecionado para dias
  const getPeriodInDays = () => {
    switch (reportPeriod) {
      case "last_30_days":
        return 30
      case "last_3_months":
        return 90
      case "last_6_months":
        return 180
      case "last_year":
        return 365
      default:
        return 180 // default to 6 months
    }
  }

  // Dados para os gráficos
  const productData = products
    .map((product) => ({
      name: product.name,
      price: product.price,
      cost: product.cost,
      margin: product.margin,
    }))
    .slice(0, 5)

  // Dados de marketing por mês (usando os dados mockados)
  const marketingData = mockMarketingData.performanceData.map((data, index) => ({
    month: data.date,
    spend: data.spend,
    conversions: data.conversions,
  }))

  const handleDownloadReport = () => {
    // Criar conteúdo do relatório
    const period =
      reportPeriod === "last_30_days"
        ? "últimos 30 dias"
        : reportPeriod === "last_3_months"
          ? "últimos 3 meses"
          : reportPeriod === "last_6_months"
            ? "últimos 6 meses"
            : "último ano"

    const totalSpend = mockMarketingData.campaignMetrics.totalSpend
    const totalConversions = mockMarketingData.campaignMetrics.conversions

    const report = `
      Relatório Consolidado - ${period}
      ===============================================
      
      Resumo de Marketing:
      - Gasto Total: ${formatCurrency(totalSpend)}
      - Conversões Totais: ${totalConversions}
      - CPA Médio: ${formatCurrency(mockMarketingData.campaignMetrics.averageCPA)}
      - ROAS: ${mockMarketingData.campaignMetrics.roas.toFixed(2)}x
      
      Produtos:
      ${products
        .slice(0, 5)
        .map((product) => `- ${product.name}: ${formatCurrency(product.price)} (Margem: ${product.margin}%)`)
        .join("\n")}
      
      Gerado em: ${new Date().toLocaleString()}
    `

    // Criar blob e download
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "relatorio-consolidado.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
              <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
              <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
              <SelectItem value="last_year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="marketing" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="marketing" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gastos de Marketing</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={mockMarketingData.spendByPlatform}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R${value}`} />
                      <Tooltip formatter={(value) => [`R${value}`, "Gasto"]} />
                      <Bar dataKey="value" fill="#3b82f6" name="Gasto" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Conversões por Período</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={marketingData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="conversions" stroke="#10b981" name="Conversões" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Preços dos Produtos</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={productData}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R${value}`} />
                      <Tooltip formatter={(value) => [`R${value}`, "Valor"]} />
                      <Bar dataKey="price" fill="#8884d8" name="Preço" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Margem de Lucro</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={productData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Margem"]} />
                      <Bar dataKey="margin" fill="#82ca9d" name="Margem (%)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Análise Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gasto em Marketing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(mockMarketingData.campaignMetrics.totalSpend)}
                    </div>
                    <p className="text-xs text-muted-foreground">No período selecionado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        mockMarketingData.campaignMetrics.totalSpend * mockMarketingData.campaignMetrics.roas,
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Baseado no ROAS atual</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Estimado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        mockMarketingData.campaignMetrics.totalSpend * mockMarketingData.campaignMetrics.roas -
                          mockMarketingData.campaignMetrics.totalSpend,
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Margem de{" "}
                      {Math.round(
                        ((mockMarketingData.campaignMetrics.roas - 1) / mockMarketingData.campaignMetrics.roas) * 100,
                      )}
                      %
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={marketingData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R${value}`} />
                    <Tooltip formatter={(value) => [`R${value}`, "Valor"]} />
                    <Line type="monotone" dataKey="spend" stroke="#3b82f6" name="Gasto" />
                    <Line
                      type="monotone"
                      dataKey="spend"
                      stroke="#10b981"
                      name="Receita"
                      // Simulando receita como ROAS * gasto
                      dataKey={(data) => data.spend * mockMarketingData.campaignMetrics.roas}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
