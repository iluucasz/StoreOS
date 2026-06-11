"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, Users, Clock, MousePointer, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAnalyticsData, NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsDashboardProps {
  isConnected: boolean
}

type DashboardData = {
  totals: {
    users: number
    sessions: number
    convRate: number
    revenue: number
    usersDelta: number
    sessionsDelta: number
    convRateDelta: number
    revenueDelta: number
  }
  usersData: { date: string; users: number; newUsers: number; sessions: number }[]
  engagementData: { date: string; pageviews: number; avgSessionDuration: number }[]
  sourceData: { name: string; value: number }[]
  conversionData: { name: string; value: number }[]
}

export function AnalyticsDashboard({ isConnected }: AnalyticsDashboardProps) {
  const { data, loading, error } = useAnalyticsData<DashboardData>("/api/google-analytics/dashboard", isConnected)

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, usersData, engagementData, sourceData, conversionData } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Usuários" value={totals.users.toLocaleString("pt-BR")} delta={totals.usersDelta} icon={<Users className="h-4 w-4" />} />
        <MetricCard title="Sessões" value={totals.sessions.toLocaleString("pt-BR")} delta={totals.sessionsDelta} icon={<Clock className="h-4 w-4" />} />
        <MetricCard title="Taxa de Conversão" value={`${totals.convRate.toFixed(1)}%`} delta={totals.convRateDelta} icon={<MousePointer className="h-4 w-4" />} />
        <MetricCard title="Receita" value={formatCurrency(totals.revenue)} delta={totals.revenueDelta} icon={<ShoppingCart className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usuários e Sessões</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#F4B400" name="Usuários" strokeWidth={2} />
                  <Line type="monotone" dataKey="newUsers" stroke="#4285F4" name="Novos Usuários" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#0F9D58" name="Sessões" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engajamento</CardTitle>
            <CardDescription>Visualizações de página e duração da sessão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="pageviews" stroke="#DB4437" name="Visualizações" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="avgSessionDuration" stroke="#4285F4" name="Duração Média (s)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
            <CardDescription>Distribuição percentual por canal (7 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentual"]} />
                  <Bar dataKey="value" fill="#F4B400" name="Percentual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Jornada do usuário até a compra (7 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4285F4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, delta, icon }: { title: string; value: string; delta: number; icon: React.ReactNode }) {
  const isUp = delta > 0
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
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            ))}
          {delta > 0 ? "+" : ""}
          {delta}% vs. período anterior
        </p>
      </CardContent>
    </Card>
  )
}
