"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, ShoppingCart, TrendingUp, Target } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useMetaData, NotConnected, LoadingState, ErrorState } from "./meta-helpers"

type DashboardData = {
  totals: {
    spend: number
    purchases: number
    revenue: number
    roas: number
    cpa: number
    ctr: number
    cpc: number
    impressions: number
    reach: number
    clicks: number
    spendDelta: number
    purchasesDelta: number
    roasDelta: number
    cpaDelta: number
  }
  series: { date: string; spend: number; clicks: number; purchases: number }[]
  platforms: { name: string; spend: number; clicks: number; purchases: number }[]
}

export function FacebookDashboard({ isConnected }: { isConnected: boolean }) {
  const { data, loading, error } = useMetaData<DashboardData>("/api/meta-ads/dashboard", isConnected)

  if (!isConnected) return <NotConnected what="o dashboard" />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, series, platforms } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Gasto (7d)" value={formatCurrency(totals.spend)} delta={totals.spendDelta} goodDirection="down" icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard title="Compras" value={totals.purchases.toLocaleString("pt-BR")} delta={totals.purchasesDelta} goodDirection="up" icon={<ShoppingCart className="h-4 w-4" />} />
        <MetricCard title="ROAS" value={`${totals.roas.toFixed(2)}x`} delta={totals.roasDelta} goodDirection="up" icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard title="Custo/Compra" value={formatCurrency(totals.cpa)} delta={totals.cpaDelta} goodDirection="down" icon={<Target className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho ao Longo do Tempo</CardTitle>
            <CardDescription>Gasto e compras nos últimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" stroke="#0866FF" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#0866FF" name="Gasto (R$)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="purchases" stroke="#10b981" name="Compras" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Principais</CardTitle>
            <CardDescription>Resumo dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <Row label="Impressões" value={totals.impressions.toLocaleString("pt-BR")} />
              <Row label="Alcance" value={totals.reach.toLocaleString("pt-BR")} />
              <Row label="Cliques" value={totals.clicks.toLocaleString("pt-BR")} />
              <Row label="CTR" value={`${totals.ctr.toFixed(2)}%`} />
              <Row label="CPC" value={formatCurrency(totals.cpc)} />
              <Row label="Receita" value={formatCurrency(totals.revenue)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Por Plataforma</CardTitle>
          <CardDescription>Gasto e compras por plataforma — Facebook vs Instagram (7 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {platforms.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sem dados por plataforma no período.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platforms}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spend" fill="#0866FF" name="Gasto (R$)" />
                  <Bar dataKey="purchases" fill="#E4405F" name="Compras" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function MetricCard({
  title,
  value,
  delta,
  goodDirection,
  icon,
}: {
  title: string
  value: string
  delta: number
  goodDirection: "up" | "down"
  icon: React.ReactNode
}) {
  const isUp = delta > 0
  const isGood = delta === 0 ? true : isUp ? goodDirection === "up" : goodDirection === "down"
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 flex items-center text-xs text-muted-foreground">
          {delta !== 0 &&
            (isUp ? (
              <ArrowUp className={`mr-1 h-3 w-3 ${isGood ? "text-green-500" : "text-red-500"}`} />
            ) : (
              <ArrowDown className={`mr-1 h-3 w-3 ${isGood ? "text-green-500" : "text-red-500"}`} />
            ))}
          {delta > 0 ? "+" : ""}
          {delta}% vs. período anterior
        </p>
      </CardContent>
    </Card>
  )
}
