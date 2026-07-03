"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertTriangle, ArrowDown, ArrowUp, DollarSign, Target, TrendingUp, Users } from "lucide-react"
import { EmptyState, ErrorState, IntegrationRequired, LoadingState } from "@/components/feedback-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

export type PlatformKey = "meta" | "googleAds" | "tiktok" | "googleAnalytics"

export type PlatformStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
  account?: { id?: string; name?: string; currency?: string } | null
}

export type PlatformStatuses = Record<PlatformKey, PlatformStatus>

type Integrations = Record<PlatformKey, boolean>

type MetaDashboard = {
  configured?: boolean
  error?: string
  totals?: {
    spend: number
    purchases: number
    revenue: number
    roas: number
    cpa: number
    spendDelta: number
    purchasesDelta: number
    roasDelta: number
    cpaDelta: number
  }
  series?: { date: string; spend: number; purchases: number }[]
  platforms?: { name: string; spend: number; purchases: number }[]
}

type GoogleAdsDashboard = {
  configured?: boolean
  error?: string
  totals?: {
    cost: number
    conversions: number
    cpa: number
    roas: number
    costDelta: number
    conversionsDelta: number
    cpaDelta: number
    roasDelta: number
  }
  series?: { date: string; spend: number; conversions: number }[]
  byCampaign?: { name: string; value: number }[]
}

type TikTokDashboard = {
  configured?: boolean
  error?: string
  totals?: {
    spend: number
    conversions: number
    cpa: number
    spendDelta: number
    conversionsDelta: number
    cpaDelta: number
  }
  series?: { date: string; spend: number; conversions: number }[]
}

type AnalyticsDashboard = {
  configured?: boolean
  error?: string
  totals?: {
    users: number
    sessions: number
    convRate: number
    revenue: number
    usersDelta: number
    sessionsDelta: number
    convRateDelta: number
    revenueDelta: number
  }
  conversionData?: { name: string; value: number }[]
  sourceData?: { name: string; value: number }[]
}

type AnalyticsConversions = {
  configured?: boolean
  error?: string
  totals?: {
    conversions: number
    conversionsDelta: number
  }
  conversionTrendsData?: { date: string; conversions: number; conversionRate: number }[]
}

type OverviewData = {
  meta: MetaDashboard | null
  googleAds: GoogleAdsDashboard | null
  tiktok: TikTokDashboard | null
  analytics: AnalyticsDashboard | null
  analyticsConversions: AnalyticsConversions | null
}

type PlatformMetric = {
  name: string
  color: string
  spend: number
  conversions: number
  cpa: number | null
  roas: number | null
  revenue: number
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" })
  const json = await response.json()
  if (!response.ok || json.error) throw new Error(json.error || "Não foi possível carregar os dados.")
  return json
}

function pctDescription(value: number, goodWhen: "up" | "down" = "up") {
  const neutral = value === 0
  const good = neutral || (goodWhen === "up" ? value > 0 : value < 0)
  return {
    label: `${value > 0 ? "+" : ""}${value}% vs. período anterior`,
    trend: neutral ? "neutral" : good ? "up" : "down",
  } as const
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

export function MarketingDashboard({
  integrations,
  statuses,
  refreshKey,
}: {
  integrations: Integrations
  statuses: PlatformStatuses
  refreshKey: number
}) {
  const [data, setData] = useState<OverviewData>({
    meta: null,
    googleAds: null,
    tiktok: null,
    analytics: null,
    analyticsConversions: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadErrors, setLoadErrors] = useState<string[]>([])

  const anyConnected = Object.values(integrations).some(Boolean)

  useEffect(() => {
    if (!anyConnected) {
      setData({ meta: null, googleAds: null, tiktok: null, analytics: null, analyticsConversions: null })
      setLoading(false)
      setError(null)
      setLoadErrors([])
      return
    }

    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      setLoadErrors([])

      const next: OverviewData = {
        meta: null,
        googleAds: null,
        tiktok: null,
        analytics: null,
        analyticsConversions: null,
      }

      try {
        const requests: { label: string; run: () => Promise<void> }[] = []

        if (integrations.meta) {
          requests.push({
            label: "Meta Ads",
            run: () => fetchJson<MetaDashboard>("/api/meta-ads/dashboard").then((result) => void (next.meta = result)),
          })
        }

        if (integrations.googleAds) {
          requests.push({
            label: "Google Ads",
            run: () =>
              fetchJson<GoogleAdsDashboard>("/api/google-ads/dashboard").then(
                (result) => void (next.googleAds = result),
              ),
          })
        }

        if (integrations.tiktok) {
          requests.push({
            label: "TikTok Ads",
            run: () => fetchJson<TikTokDashboard>("/api/tiktok-ads/dashboard").then((result) => void (next.tiktok = result)),
          })
        }

        if (integrations.googleAnalytics) {
          requests.push(
            {
              label: "Google Analytics",
              run: () =>
                fetchJson<AnalyticsDashboard>("/api/google-analytics/dashboard").then(
                  (result) => void (next.analytics = result),
                ),
            },
            {
              label: "Conversões do GA4",
              run: () =>
                fetchJson<AnalyticsConversions>("/api/google-analytics/conversions").then(
                  (result) => void (next.analyticsConversions = result),
                ),
            },
          )
        }

        const results = await Promise.all(
          requests.map(async (request) => {
            try {
              await request.run()
              return null
            } catch (requestError) {
              const message =
                requestError instanceof Error ? requestError.message : "Não foi possível carregar os dados."
              return `${request.label}: ${message}`
            }
          }),
        )

        const failedRequests = results.filter((result): result is string => Boolean(result))
        if (active) {
          setData(next)
          setLoadErrors(failedRequests)
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados reais.")
          setData(next)
          setLoadErrors([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [anyConnected, integrations.meta, integrations.googleAds, integrations.tiktok, integrations.googleAnalytics, refreshKey])

  const platformMetrics = useMemo<PlatformMetric[]>(() => {
    const metaSpend = data.meta?.totals?.spend ?? 0
    const metaConversions = data.meta?.totals?.purchases ?? 0
    const metaRevenue = data.meta?.totals?.revenue ?? 0

    const googleSpend = data.googleAds?.totals?.cost ?? 0
    const googleConversions = data.googleAds?.totals?.conversions ?? 0
    const googleRevenue = googleSpend * (data.googleAds?.totals?.roas ?? 0)

    const tiktokSpend = data.tiktok?.totals?.spend ?? 0
    const tiktokConversions = data.tiktok?.totals?.conversions ?? 0

    const analyticsConversions = data.analyticsConversions?.totals?.conversions ?? 0

    const metrics: PlatformMetric[] = []

    if (statuses.meta.connected && data.meta) {
      metrics.push({
        name: "Meta Ads",
        color: "#0866FF",
        spend: metaSpend,
        conversions: metaConversions,
        cpa: metaConversions ? metaSpend / metaConversions : null,
        roas: data.meta?.totals?.roas ?? null,
        revenue: metaRevenue,
      })
    }

    if (statuses.googleAds.connected && data.googleAds) {
      metrics.push({
        name: "Google Ads",
        color: "#DB4437",
        spend: googleSpend,
        conversions: googleConversions,
        cpa: data.googleAds?.totals?.cpa ?? null,
        roas: data.googleAds?.totals?.roas ?? null,
        revenue: googleRevenue,
      })
    }

    if (statuses.tiktok.connected && data.tiktok) {
      metrics.push({
        name: "TikTok Ads",
        color: "#111111",
        spend: tiktokSpend,
        conversions: tiktokConversions,
        cpa: data.tiktok?.totals?.cpa ?? null,
        roas: null,
        revenue: 0,
      })
    }

    if (statuses.googleAnalytics.connected && (data.analytics || data.analyticsConversions)) {
      metrics.push({
        name: "Analytics",
        color: "#F4B400",
        spend: 0,
        conversions: analyticsConversions,
        cpa: null,
        roas: null,
        revenue: data.analytics?.totals?.revenue ?? 0,
      })
    }

    return metrics
  }, [data, statuses])

  const totals = useMemo(() => {
    const adMetrics = platformMetrics.filter((metric) => metric.name !== "Analytics")
    const totalSpend = sum(adMetrics.map((metric) => metric.spend))
    const conversions = sum(adMetrics.map((metric) => metric.conversions))
    const revenue = sum(adMetrics.map((metric) => metric.revenue))
    const cpa = conversions ? totalSpend / conversions : 0
    const roas = totalSpend ? revenue / totalSpend : 0

    const spendDelta = Math.round(
      sum([
        data.meta?.totals?.spendDelta ?? 0,
        data.googleAds?.totals?.costDelta ?? 0,
        data.tiktok?.totals?.spendDelta ?? 0,
      ]) / Math.max(adMetrics.length, 1),
    )
    const conversionsDelta = Math.round(
      sum([
        data.meta?.totals?.purchasesDelta ?? 0,
        data.googleAds?.totals?.conversionsDelta ?? 0,
        data.tiktok?.totals?.conversionsDelta ?? 0,
      ]) / Math.max(adMetrics.length, 1),
    )
    const cpaDelta = Math.round(
      sum([data.meta?.totals?.cpaDelta ?? 0, data.googleAds?.totals?.cpaDelta ?? 0, data.tiktok?.totals?.cpaDelta ?? 0]) /
        Math.max(adMetrics.length, 1),
    )
    const roasDeltas = [data.meta?.totals?.roasDelta, data.googleAds?.totals?.roasDelta].filter(
      (value): value is number => typeof value === "number",
    )
    const roasDelta = Math.round(sum(roasDeltas) / Math.max(roasDeltas.length, 1))

    return { totalSpend, conversions, revenue, cpa, roas, spendDelta, conversionsDelta, cpaDelta, roasDelta }
  }, [data, platformMetrics])

  const performanceData = useMemo(() => {
    const rows = new Map<string, { date: string; spend: number; conversions: number }>()
    const addRow = (date: string, spend: number, conversions: number) => {
      const current = rows.get(date) ?? { date, spend: 0, conversions: 0 }
      current.spend += spend
      current.conversions += conversions
      rows.set(date, current)
    }

    data.meta?.series?.forEach((row) => addRow(row.date, row.spend, row.purchases))
    data.googleAds?.series?.forEach((row) => addRow(row.date, row.spend, row.conversions))
    data.tiktok?.series?.forEach((row) => addRow(row.date, row.spend, row.conversions))

    return [...rows.values()]
  }, [data])

  const funnelData = data.analytics?.conversionData ?? []
  const sourcesData = data.analytics?.sourceData ?? []

  if (!anyConnected) {
    return (
      <IntegrationRequired
        service="uma plataforma de marketing"
        description="Conecte Meta Ads, Google Ads, TikTok Ads ou Google Analytics para preencher este painel com dados reais."
      />
    )
  }

  if (loading) return <LoadingState label="Carregando dados reais de marketing..." className="min-h-72" />

  if (error) {
    return (
      <ErrorState
        title="Não foi possível carregar a visão de marketing"
        description={error}
        className="min-h-72"
      />
    )
  }

  const hasLoadedData =
    Boolean(data.meta) ||
    Boolean(data.googleAds) ||
    Boolean(data.tiktok) ||
    Boolean(data.analytics) ||
    Boolean(data.analyticsConversions)

  if (!hasLoadedData && loadErrors.length > 0) {
    return (
      <ErrorState
        title="Não foi possível carregar a visão de marketing"
        description={loadErrors.join(" ")}
        className="min-h-72"
      />
    )
  }

  const spendTrend = pctDescription(totals.spendDelta)
  const conversionTrend = pctDescription(totals.conversionsDelta)
  const cpaTrend = pctDescription(totals.cpaDelta, "down")
  const roasTrend = pctDescription(totals.roasDelta)

  return (
    <div className="space-y-6">
      {loadErrors.length > 0 ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-700 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Alguns dados reais não carregaram.</p>
              <p>{loadErrors.join(" ")}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gasto em anúncios"
          value={formatCurrency(totals.totalSpend)}
          description={spendTrend.label}
          icon={<DollarSign className="h-4 w-4" />}
          trend={spendTrend.trend}
        />
        <MetricCard
          title="Conversões de ads"
          value={totals.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
          description={conversionTrend.label}
          icon={<Users className="h-4 w-4" />}
          trend={conversionTrend.trend}
        />
        <MetricCard
          title="CPA médio"
          value={totals.cpa ? formatCurrency(totals.cpa) : "—"}
          description={cpaTrend.label}
          icon={<Target className="h-4 w-4" />}
          trend={cpaTrend.trend}
        />
        <MetricCard
          title="ROAS atribuído"
          value={totals.roas ? `${totals.roas.toFixed(2)}x` : "—"}
          description={roasTrend.label}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={roasTrend.trend}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por plataforma</CardTitle>
          <CardDescription>Valores reais retornados pelas integrações conectadas.</CardDescription>
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
              <PlatformBarChart data={platformMetrics} dataKey="spend" formatter={(value) => formatCurrency(Number(value))} />
            </TabsContent>
            <TabsContent value="conversions" className="mt-4">
              <PlatformBarChart data={platformMetrics} dataKey="conversions" formatter={(value) => Number(value).toLocaleString("pt-BR")} />
            </TabsContent>
            <TabsContent value="cpa" className="mt-4">
              <PlatformBarChart data={platformMetrics} dataKey="cpa" formatter={(value) => formatCurrency(Number(value || 0))} />
            </TabsContent>
            <TabsContent value="roas" className="mt-4">
              <PlatformBarChart data={platformMetrics} dataKey="roas" formatter={(value) => `${Number(value || 0).toFixed(2)}x`} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos vs. conversões</CardTitle>
            <CardDescription>Série combinada das plataformas de anúncios conectadas.</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData.length === 0 ? (
              <EmptyState title="Sem série histórica" description="As integrações conectadas ainda não retornaram dados diários." />
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `R$${value}`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [name === "spend" ? formatCurrency(Number(value)) : value, name === "spend" ? "Gasto" : "Conversões"]} />
                    <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#15803d" name="Gasto" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" name="Conversões" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canais do Analytics</CardTitle>
            <CardDescription>Distribuição real de sessões por canal no GA4.</CardDescription>
          </CardHeader>
          <CardContent>
            {!statuses.googleAnalytics.connected ? (
              <IntegrationRequired service="Google Analytics" description="Conecte o GA4 para visualizar canais de tráfego." />
            ) : sourcesData.length === 0 ? (
              <EmptyState title="Sem canais no período" description="O GA4 não retornou sessões por canal." />
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourcesData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, "Sessões"]} />
                    <Bar dataKey="value" fill="#F4B400" name="Sessões" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funil de conversão do site</CardTitle>
          <CardDescription>Eventos reais do GA4 para visualizações, carrinho, checkout e compras.</CardDescription>
        </CardHeader>
        <CardContent>
          {!statuses.googleAnalytics.connected ? (
            <IntegrationRequired service="Google Analytics" description="Conecte o GA4 para visualizar o funil do site." />
          ) : funnelData.length === 0 ? (
            <EmptyState title="Sem eventos de funil" description="O GA4 ainda não retornou eventos de e-commerce para o período." />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={170} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PlatformBarChart({
  data,
  dataKey,
  formatter,
}: {
  data: PlatformMetric[]
  dataKey: keyof PlatformMetric
  formatter: (value: unknown) => string
}) {
  const chartData = data.map((row) => ({ ...row, [dataKey]: row[dataKey] ?? 0 }))

  if (chartData.length === 0) {
    return <EmptyState title="Sem dados por plataforma" description="Nenhuma integração conectada retornou dados para este gráfico." />
  }

  return (
    <div className="h-52 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [formatter(value), String(dataKey).toUpperCase()]} />
          <Bar dataKey={dataKey as string} name={String(dataKey)} radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
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
        <p className="mt-1 flex items-center text-xs text-muted-foreground">
          {trend === "up" ? (
            <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
          ) : trend === "down" ? (
            <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
          ) : null}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
