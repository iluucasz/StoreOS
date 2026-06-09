"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Target, Zap, Download, type LucideIcon } from "lucide-react"
import { DRE } from "./components/dre"
import { CashFlow } from "./components/cash-flow"
import { Accounts } from "./components/accounts"
import { ProductProfitability } from "./components/product-profitability"

const performanceData = [
  { mes: "Jan", receita: 18500, lucro: 13700, gasto: 4800 },
  { mes: "Fev", receita: 21000, lucro: 15600, gasto: 5400 },
  { mes: "Mar", receita: 19800, lucro: 14700, gasto: 5100 },
  { mes: "Abr", receita: 24500, lucro: 18200, gasto: 6300 },
  { mes: "Mai", receita: 28000, lucro: 20500, gasto: 7500 },
  { mes: "Jun", receita: 26500, lucro: 19700, gasto: 6800 },
]

const spendByPlatform = [
  { plataforma: "Meta Ads", gasto: 4200, receita: 14700 },
  { plataforma: "Google Ads", gasto: 2100, receita: 8400 },
  { plataforma: "Orgânico", gasto: 0, receita: 5900 },
]

const kpis = {
  receita: 26500,
  receitaChange: 8.2,
  lucro: 19700,
  lucroChange: 7.6,
  cac: 12.5,
  cacChange: -3.2,
  roas: 3.5,
  roasChange: 5.1,
  margem: 74.3,
  margemChange: 0.8,
}

function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  lowerIsBetter = false,
}: {
  title: string
  value: string
  change: number
  icon: LucideIcon
  lowerIsBetter?: boolean
}) {
  const isPositive = change >= 0
  const good = lowerIsBetter ? !isPositive : isPositive

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs flex items-center gap-1 mt-1 ${good ? "text-emerald-600" : "text-red-500"}`}>
          {good ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change)}% vs período anterior
        </p>
      </CardContent>
    </Card>
  )
}

export default function FinanceiroPage() {
  const [period, setPeriod] = useState("last_6_months")

  const handleExport = () => {
    const report = [
      "Relatório Financeiro — StoreOS",
      "",
      `Receita: ${formatCurrency(kpis.receita)}`,
      `Lucro: ${formatCurrency(kpis.lucro)}`,
      `CAC: ${formatCurrency(kpis.cac)}`,
      `ROAS: ${kpis.roas.toFixed(2)}x`,
      `Margem: ${kpis.margem}%`,
      "",
      `Gerado em: ${new Date().toLocaleString()}`,
    ].join("\n")

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "financeiro-storeos.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-muted-foreground">
            Receita, lucro e eficiência consolidados — Meta Ads, Google Ads e loja
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
              <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
              <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
              <SelectItem value="last_year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">Conexões:</span>
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          ● Shopify
        </Badge>
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          ● Meta Ads
        </Badge>
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          ● Google Ads
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto mb-6">
          <TabsList className="w-max min-w-full grid grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="dre">DRE</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
            <KpiCard title="Receita" value={formatCurrency(kpis.receita)} change={kpis.receitaChange} icon={DollarSign} />
            <KpiCard title="Lucro" value={formatCurrency(kpis.lucro)} change={kpis.lucroChange} icon={TrendingUp} />
            <KpiCard title="CAC" value={formatCurrency(kpis.cac)} change={kpis.cacChange} icon={Target} lowerIsBetter />
            <KpiCard title="ROAS" value={`${kpis.roas.toFixed(1)}x`} change={kpis.roasChange} icon={Zap} />
            <KpiCard title="Margem" value={`${kpis.margem}%`} change={kpis.margemChange} icon={ShoppingBag} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita vs Lucro</CardTitle>
                <CardDescription>Evolução mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-52 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                      <Legend />
                      <Line type="monotone" dataKey="receita" stroke="#3b82f6" name="Receita" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="lucro" stroke="#10b981" name="Lucro" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Canal</CardTitle>
                <CardDescription>Gasto vs receita gerada por plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-52 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendByPlatform}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plataforma" />
                      <YAxis tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                      <Legend />
                      <Bar dataKey="gasto" fill="#f87171" name="Gasto" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="receita" fill="#34d399" name="Receita" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dre"><DRE /></TabsContent>
        <TabsContent value="cashflow"><CashFlow /></TabsContent>
        <TabsContent value="accounts"><Accounts /></TabsContent>
        <TabsContent value="produtos"><ProductProfitability /></TabsContent>
      </Tabs>
    </div>
  )
}
