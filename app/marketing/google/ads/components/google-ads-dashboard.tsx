"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, Users, Target, TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface GoogleAdsDashboardProps {
  isConnected: boolean
}

export function GoogleAdsDashboard({ isConnected }: GoogleAdsDashboardProps) {
  // Mock data
  const performanceData = [
    { date: "01/04", spend: 90, impressions: 12000, clicks: 350, conversions: 10 },
    { date: "02/04", spend: 85, impressions: 11500, clicks: 330, conversions: 9 },
    { date: "03/04", spend: 95, impressions: 13000, clicks: 380, conversions: 12 },
    { date: "04/04", spend: 100, impressions: 14000, clicks: 420, conversions: 15 },
    { date: "05/04", spend: 105, impressions: 15000, clicks: 450, conversions: 18 },
    { date: "06/04", spend: 110, impressions: 16000, clicks: 480, conversions: 20 },
    { date: "07/04", spend: 115, impressions: 17000, clicks: 510, conversions: 22 },
  ]

  const campaignData = [
    { name: "Pesquisa", value: 500 },
    { name: "Display", value: 300 },
    { name: "Shopping", value: 200 },
    { name: "YouTube", value: 150 },
  ]

  const keywordData = [
    { name: "marketing digital", value: 120 },
    { name: "agência marketing", value: 95 },
    { name: "consultoria seo", value: 85 },
    { name: "anúncios google", value: 75 },
  ]

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte-se ao Google Ads</CardTitle>
          <CardDescription>
            Conecte sua conta do Google Ads para visualizar métricas e gerenciar campanhas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-center text-muted-foreground mb-4">
            Você precisa conectar sua conta do Google Ads para visualizar o dashboard
          </p>
          <img src="/digital-marketing-overview.png" alt="Google Ads Dashboard" className="rounded-lg mb-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gasto Total"
          value={formatCurrency(9800)}
          description="+8% vs. período anterior"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="Conversões"
          value="200"
          description="+15% vs. período anterior"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="CPA Médio"
          value={formatCurrency(49)}
          description="-7% vs. período anterior"
          icon={<Target className="h-4 w-4" />}
          trend="up"
        />

        <MetricCard
          title="ROAS"
          value="4.5x"
          description="+12% vs. período anterior"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
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
                <LineChart data={performanceData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#DB4437" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="spend"
                    stroke="#DB4437"
                    name="Gasto (R$)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    name="Conversões"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Desempenho</CardTitle>
            <CardDescription>CTR, CPC e Impressões nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
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
          <CardDescription>Análise de campanhas e palavras-chave</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value) => [`R$${value}`, "Gasto"]} />
                    <Bar dataKey="value" fill="#DB4437" name="Gasto" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="keywords" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={keywordData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value) => [`R$${value}`, "Gasto"]} />
                    <Bar dataKey="value" fill="#DB4437" name="Gasto" />
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
