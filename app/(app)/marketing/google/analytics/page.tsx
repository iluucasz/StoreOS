"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, Check, ArrowLeft, Loader2 } from "lucide-react"
import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { AnalyticsAcquisition } from "./components/analytics-acquisition"
import { AnalyticsEngagement } from "./components/analytics-engagement"
import { AnalyticsConversions } from "./components/analytics-conversions"
import { AnalyticsEcommerce } from "./components/analytics-ecommerce"
import { AnalyticsRealtime } from "./components/analytics-realtime"
import { AnalyticsIntegration } from "./components/analytics-integration"
import Link from "next/link"

export type AnalyticsStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
}

export default function GoogleAnalyticsPage() {
  const [tab, setTab] = useState("dashboard")
  const [status, setStatus] = useState<AnalyticsStatus>({ loading: true, configured: false, connected: false })

  const checkStatus = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true }))
    try {
      const res = await fetch("/api/google-analytics/test", { cache: "no-store" })
      const json = await res.json()
      setStatus({
        loading: false,
        configured: !!json.configured,
        connected: !!json.connected,
        error: json.error,
      })
    } catch {
      setStatus({ loading: false, configured: false, connected: false, error: "Falha ao verificar conexão" })
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const isConnected = status.connected

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketing">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-[#F4B400] shrink-0" />
            Google Analytics
          </h1>
          <p className="text-muted-foreground">Analise o desempenho do seu site com Google Analytics 4</p>
        </div>
        <div className="shrink-0">
          {status.loading ? (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-1 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          ) : (
            <Button onClick={() => setTab("integration")}>
              <Activity className="mr-2 h-4 w-4" />
              Configurar integração
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <div className="overflow-x-auto">
          <TabsList className="w-max min-w-full grid grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="conversions">Conversões</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          <AnalyticsDashboard isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="acquisition" className="mt-6">
          <AnalyticsAcquisition isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="engagement" className="mt-6">
          <AnalyticsEngagement isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="conversions" className="mt-6">
          <AnalyticsConversions isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="ecommerce" className="mt-6">
          <AnalyticsEcommerce isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="realtime" className="mt-6">
          <AnalyticsRealtime isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="integration" className="mt-6">
          <AnalyticsIntegration status={status} onRecheck={checkStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
