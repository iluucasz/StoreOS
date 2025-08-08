"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, Users, Clock, MousePointer, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface AnalyticsDashboardProps {
  isConnected: boolean
}

export function AnalyticsDashboard({ isConnected }: AnalyticsDashboardProps) {
  // Mock data
  const usersData = [
    { date: "01/04", users: 1200, newUsers: 450, sessions: 1500 },
    { date: "02/04", users: 1300, newUsers: 480, sessions: 1600 },
    { date: "03/04", users: 1400, newUsers: 510, sessions: 1700 },
    { date: "04/04", users: 1500, newUsers: 540, sessions: 1800 },
    { date: "05/04", users: 1600, newUsers: 570, sessions: 1900 },
    { date: "06/04", users: 1700, newUsers: 600, sessions: 2000 },
    { date: "07/04", users: 1800, newUsers: 630, sessions: 2100 },
  ]

  const engagementData = [
    { date: "01/04", pageviews: 3500, avgSessionDuration: 120, bounceRate: 45 },
    { date: "02/04", pageviews: 3700, avgSessionDuration: 125, bounceRate: 44 },
    { date: "03/04", pageviews: 3900, avgSessionDuration: 130, bounceRate: 43 },
    { date: "04/04", pageviews: 4100, avgSessionDuration: 135, bounceRate: 42 },
    { date: "05/04", pageviews: 4300, avgSessionDuration: 140, bounceRate: 41 },
    { date: "06/04", pageviews: 4500, avgSessionDuration: 145, bounceRate: 40 },
    { date: "07/04", pageviews: 4700, avgSessionDuration: 150, bounceRate: 39 },
  ]

  const sourceData = [
    { name: "Orgânico", value: 35 },
    { name: "Direto", value: 25 },
    { name: "Referência", value: 15 },
    { name: "Social", value: 15 },
    { name: "Email", value: 10 },
  ]

  const conversionData = [
    { name: "Visualizações", value: 15000 },
    { name: "Adições ao Carrinho", value: 1200 },
    { name: "Checkouts Iniciados", value: 800 },
    { name: "Compras", value: 450 },
  ]

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte-se ao Google Analytics</CardTitle>
          <CardDescription>
            Conecte sua conta do Google Analytics para visualizar métricas de desempenho do seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-center text-muted-foreground mb-4">
            Você precisa conectar sua conta do Google Analytics para visualizar o dashboard
          </p>
          <img src="/website-performance-overview.png" alt="Google Analytics Dashboard" className="rounded-lg mb-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Usuários"
          value="15,842"
          description="+12% vs. período anterior"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="Sessões"
          value="21,350"
          description="+8% vs. período anterior"
          icon={<Clock className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="Taxa de Conversão"
          value="3.2%"
          description="+0.5% vs. período anterior"
          icon={<MousePointer className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="Receita"
          value={formatCurrency(98500)}
          description="+15% vs. período anterior"
          icon={<ShoppingCart className="h-4 w-4" />}
          trend="up"
        />
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
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="pageviews"
                    stroke="#DB4437"
                    name="Visualizações"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgSessionDuration"
                    stroke="#4285F4"
                    name="Duração Média (s)"
                    strokeWidth={2}
                  />
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
            <CardDescription>Distribuição percentual por canal</CardDescription>
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
            <CardDescription>Jornada do usuário até a conversão</CardDescription>
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

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === "up" ? (
            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
          ) : trend === "down" ? (
            <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
          ) : null}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
