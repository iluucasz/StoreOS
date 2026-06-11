"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingCart, Activity } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useAnalyticsData, NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsConversionsProps {
  isConnected: boolean
}

type ConversionsData = {
  totals: {
    conversions: number
    convRate: number
    value: number
    avgValue: number
    conversionsDelta: number
    convRateDelta: number
    valueDelta: number
    avgValueDelta: number
  }
  conversionTrendsData: { date: string; conversions: number; conversionRate: number }[]
  goalCompletionsData: { goal: string; completions: number; value: number; conversionRate: number }[]
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

export function AnalyticsConversions({ isConnected }: AnalyticsConversionsProps) {
  const { data, loading, error } = useAnalyticsData<ConversionsData>("/api/google-analytics/conversions", isConnected)

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, conversionTrendsData, goalCompletionsData } = data

  const cards = [
    { title: "Total de Conversões", value: totals.conversions.toLocaleString("pt-BR"), delta: totals.conversionsDelta, icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Taxa de Conversão", value: `${totals.convRate.toFixed(1)}%`, delta: totals.convRateDelta, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
    { title: "Valor de Conversão", value: formatCurrency(totals.value), delta: totals.valueDelta, icon: <Activity className="h-4 w-4 text-muted-foreground" /> },
    { title: "Valor Médio", value: formatCurrency(totals.avgValue), delta: totals.avgValueDelta, icon: <BarChart2 className="h-4 w-4 text-muted-foreground" /> },
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
                <Line yAxisId="left" type="monotone" dataKey="conversions" name="Conversões" stroke="#3B82F6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="conversionRate" name="Taxa de Conversão (%)" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos de Conversão</CardTitle>
          <CardDescription>Desempenho dos principais eventos de conversão (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {goalCompletionsData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum evento de conversão no período.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Conclusões</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-right">Taxa de Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goalCompletionsData.map((row) => (
                  <TableRow key={row.goal}>
                    <TableCell className="font-medium">{row.goal}</TableCell>
                    <TableCell className="text-right">{row.completions.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{row.value.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{row.conversionRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
