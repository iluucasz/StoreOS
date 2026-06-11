"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, Users, Target, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

interface GoogleAdsDashboardProps {
  isConnected: boolean
}

type DashboardData = {
  totals: {
    cost: number
    conversions: number
    cpa: number
    roas: number
    costDelta: number
    conversionsDelta: number
    cpaDelta: number
    roasDelta: number
  }
  series: { date: string; spend: number; impressions: number; clicks: number; conversions: number }[]
  byCampaign: { name: string; value: number }[]
  byKeyword: { name: string; value: number }[]
}

export function GoogleAdsDashboard({ isConnected }: GoogleAdsDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)
    fetch("/api/google-ads/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else setData(json)
      })
      .catch(() => active && setError("Falha ao carregar o dashboard"))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte-se ao Google Ads</CardTitle>
          <CardDescription>
            Configure a integração na aba “Integração” para visualizar métricas e campanhas reais.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-center text-muted-foreground">
            Você precisa conectar sua conta do Google Ads para visualizar o dashboard.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando dados do Google Ads...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  const { totals, series, byCampaign, byKeyword } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gasto Total"
          value={formatCurrency(totals.cost)}
          delta={totals.costDelta}
          goodDirection="down"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Conversões"
          value={totals.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
          delta={totals.conversionsDelta}
          goodDirection="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="CPA Médio"
          value={formatCurrency(totals.cpa)}
          delta={totals.cpaDelta}
          goodDirection="down"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="ROAS"
          value={`${totals.roas.toFixed(1)}x`}
          delta={totals.roasDelta}
          goodDirection="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho ao Longo do Tempo</CardTitle>
            <CardDescription>Gastos e conversões nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#DB4437" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#DB4437" name="Gasto (R$)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" name="Conversões" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Desempenho</CardTitle>
            <CardDescription>Cliques e impressões nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#f59e0b" name="Cliques" strokeWidth={2} />
                  <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" name="Impressões" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Segmento</CardTitle>
          <CardDescription>Gasto por campanha e palavra-chave (7 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns" className="mt-4">
              <SegmentChart data={byCampaign} />
            </TabsContent>
            <TabsContent value="keywords" className="mt-4">
              <SegmentChart data={byKeyword} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function SegmentChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-10 text-center">Sem dados de gasto no período.</p>
  }
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `R$${value}`} />
          <Tooltip formatter={(value) => [`R$${value}`, "Gasto"]} />
          <Bar dataKey="value" fill="#DB4437" name="Gasto" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  delta: number
  goodDirection: "up" | "down"
  icon: React.ReactNode
}

function MetricCard({ title, value, delta, goodDirection, icon }: MetricCardProps) {
  const isUp = delta > 0
  const isGood = delta === 0 ? true : (isUp ? goodDirection === "up" : goodDirection === "down")
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {delta !== 0 &&
            (isUp ? (
              <ArrowUp className={`h-3 w-3 mr-1 ${isGood ? "text-green-500" : "text-red-500"}`} />
            ) : (
              <ArrowDown className={`h-3 w-3 mr-1 ${isGood ? "text-green-500" : "text-red-500"}`} />
            ))}
          {delta > 0 ? "+" : ""}
          {delta}% vs. período anterior
        </p>
      </CardContent>
    </Card>
  )
}
