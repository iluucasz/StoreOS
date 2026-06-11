"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, Target, MousePointer, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useTikTokData, NotConnected, LoadingState, ErrorState } from "./tiktok-helpers"

type DashboardData = {
  totals: {
    spend: number
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpa: number
    spendDelta: number
    conversionsDelta: number
    cpaDelta: number
  }
  series: { date: string; spend: number; clicks: number; conversions: number }[]
}

export function TikTokDashboard({ isConnected }: { isConnected: boolean }) {
  const { data, loading, error } = useTikTokData<DashboardData>("/api/tiktok-ads/dashboard", isConnected)

  if (!isConnected) return <NotConnected what="o dashboard" />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, series } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Gasto (14d)" value={formatCurrency(totals.spend)} delta={totals.spendDelta} goodDirection="down" icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard title="Conversões" value={totals.conversions.toLocaleString("pt-BR")} delta={totals.conversionsDelta} goodDirection="up" icon={<Zap className="h-4 w-4" />} />
        <MetricCard title="Custo/Conversão" value={formatCurrency(totals.cpa)} delta={totals.cpaDelta} goodDirection="down" icon={<Target className="h-4 w-4" />} />
        <MetricCard title="CTR" value={`${totals.ctr.toFixed(2)}%`} delta={0} goodDirection="up" icon={<MousePointer className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho ao Longo do Tempo</CardTitle>
          <CardDescription>Gasto e conversões nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          {series.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Sem dados no período.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" stroke="#FE2C55" />
                  <YAxis yAxisId="right" orientation="right" stroke="#25c2cc" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#FE2C55" name="Gasto (R$)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#25c2cc" name="Conversões" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
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
          {delta !== 0 ? `${delta > 0 ? "+" : ""}${delta}% vs. período anterior` : "últimos 14 dias"}
        </p>
      </CardContent>
    </Card>
  )
}
