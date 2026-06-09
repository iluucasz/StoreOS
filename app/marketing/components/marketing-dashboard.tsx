"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, Users, Target, TrendingUp, Facebook, BarChart4, Activity } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { mockMarketingData } from "@/app/marketing/data/mock-data"

interface MarketingDashboardProps {
  integrations: {
    facebook: boolean
    googleAds: boolean
    googleAnalytics: boolean
  }
}

export function MarketingDashboard({ integrations }: MarketingDashboardProps) {
  const { performanceData, campaignMetrics, spendByPlatform, conversionData } = mockMarketingData
  const anyConnected = Object.values(integrations).some((status) => status)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gasto Total"
          value={formatCurrency(campaignMetrics.totalSpend)}
          description={`${campaignMetrics.spendChange >= 0 ? "+" : ""}${campaignMetrics.spendChange}% vs. período anterior`}
          icon={<DollarSign className="h-4 w-4" />}
          trend={campaignMetrics.spendChange >= 0 ? "up" : "down"}
        />

        <MetricCard
          title="Conversões"
          value={campaignMetrics.conversions.toString()}
          description={`${campaignMetrics.conversionChange >= 0 ? "+" : ""}${campaignMetrics.conversionChange}% vs. período anterior`}
          icon={<Users className="h-4 w-4" />}
          trend={campaignMetrics.conversionChange >= 0 ? "up" : "down"}
        />

        <MetricCard
          title="CPA Médio"
          value={formatCurrency(campaignMetrics.averageCPA)}
          description={`${campaignMetrics.cpaChange <= 0 ? "+" : ""}${Math.abs(campaignMetrics.cpaChange)}% vs. período anterior`}
          icon={<Target className="h-4 w-4" />}
          trend={campaignMetrics.cpaChange <= 0 ? "up" : "down"}
        />

        <MetricCard
          title="ROAS"
          value={`${campaignMetrics.roas.toFixed(2)}x`}
          description={`${campaignMetrics.roasChange >= 0 ? "+" : ""}${campaignMetrics.roasChange}% vs. período anterior`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={campaignMetrics.roasChange >= 0 ? "up" : "down"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Plataforma</CardTitle>
          <CardDescription>Comparação de métricas entre plataformas de marketing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spend">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="spend">Gastos</TabsTrigger>
              <TabsTrigger value="conversions">Conversões</TabsTrigger>
              <TabsTrigger value="cpa">CPA</TabsTrigger>
              <TabsTrigger value="roas">ROAS</TabsTrigger>
            </TabsList>
            <TabsContent value="spend" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Facebook Ads", value: 800, icon: Facebook },
                      { name: "Google Ads", value: 650, icon: BarChart4 },
                      { name: "Google Analytics", value: 0, icon: Activity },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R${value}`} />
                    <Tooltip formatter={(value) => [`R${value}`, "Gasto"]} />
                    <Bar dataKey="value" fill="#8884d8" name="Gasto">
                      {/* Renderização condicional baseada no status de integração */}
                      {[
                        { key: "Facebook Ads", color: integrations.facebook ? "#4267B2" : "#ccc" },
                        { key: "Google Ads", color: integrations.googleAds ? "#DB4437" : "#ccc" },
                        { key: "Google Analytics", color: integrations.googleAnalytics ? "#F4B400" : "#ccc" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="conversions" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Facebook Ads", value: 40 },
                      { name: "Google Ads", value: 35 },
                      { name: "Google Analytics", value: 25 },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Conversões"]} />
                    <Bar dataKey="value" fill="#82ca9d" name="Conversões">
                      {[
                        { key: "Facebook Ads", color: integrations.facebook ? "#4267B2" : "#ccc" },
                        { key: "Google Ads", color: integrations.googleAds ? "#DB4437" : "#ccc" },
                        { key: "Google Analytics", color: integrations.googleAnalytics ? "#F4B400" : "#ccc" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="cpa" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Facebook Ads", value: 20 },
                      { name: "Google Ads", value: 18.57 },
                      { name: "Google Analytics", value: 22.5 },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R${value}`} />
                    <Tooltip formatter={(value) => [`R${value}`, "CPA"]} />
                    <Bar dataKey="value" fill="#ff7300" name="CPA">
                      {[
                        { key: "Facebook Ads", color: integrations.facebook ? "#4267B2" : "#ccc" },
                        { key: "Google Ads", color: integrations.googleAds ? "#DB4437" : "#ccc" },
                        { key: "Google Analytics", color: integrations.googleAnalytics ? "#F4B400" : "#ccc" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="roas" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Facebook Ads", value: 4.5 },
                      { name: "Google Ads", value: 5.2 },
                      { name: "Google Analytics", value: 3.8 },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}x`, "ROAS"]} />
                    <Bar dataKey="value" fill="#8884d8" name="ROAS">
                      {[
                        { key: "Facebook Ads", color: integrations.facebook ? "#4267B2" : "#ccc" },
                        { key: "Google Ads", color: integrations.googleAds ? "#DB4437" : "#ccc" },
                        { key: "Google Analytics", color: integrations.googleAnalytics ? "#F4B400" : "#ccc" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance ao Longo do Tempo</CardTitle>
            <CardDescription>Gastos vs. Conversões nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="spend"
                    stroke="#3b82f6"
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
            <CardTitle>Distribuição de Gastos</CardTitle>
            <CardDescription>Gastos por plataforma/campanha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByPlatform}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R${value}`} />
                  <Tooltip formatter={(value) => [`R${value}`, "Gasto"]} />
                  <Bar dataKey="value" fill="#8884d8" name="Gasto" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Conversão</CardTitle>
          <CardDescription>Análise detalhada do funil de conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="funnel">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="funnel">Funil</TabsTrigger>
              <TabsTrigger value="cpa">CPA</TabsTrigger>
              <TabsTrigger value="roas">ROAS</TabsTrigger>
            </TabsList>
            <TabsContent value="funnel" className="mt-4">
              <div className="h-52 md:h-80">
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
            <TabsContent value="cpa" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData.cpaOverTime}>
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `R${value}`} />
                    <Tooltip formatter={(value) => [`R${value}`, "CPA"]} />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="roas" className="mt-4">
              <div className="h-52 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData.roasOverTime}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}x`, "ROAS"]} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
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

// Componente Cell para colorir as barras
function Cell({ fill, ...props }: { fill: string }) {
  return <rect {...props} fill={fill} />
}
