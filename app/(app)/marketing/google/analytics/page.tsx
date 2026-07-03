"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Activity, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsAcquisition } from "./components/analytics-acquisition"
import { AnalyticsConversions } from "./components/analytics-conversions"
import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { AnalyticsEcommerce } from "./components/analytics-ecommerce"
import { AnalyticsEngagement } from "./components/analytics-engagement"
import { AnalyticsIntegration } from "./components/analytics-integration"
import { AnalyticsRealtime } from "./components/analytics-realtime"

export type AnalyticsStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
  account?: { id?: string; name?: string } | null
  activeUsers7d?: number
}

type Notice = { type: "success" | "error"; message: string }

export default function GoogleAnalyticsPage() {
  const [tab, setTab] = useState("dashboard")
  const [status, setStatus] = useState<AnalyticsStatus>({ loading: true, configured: false, connected: false })
  const [notice, setNotice] = useState<Notice | null>(null)

  const checkStatus = useCallback(async () => {
    setStatus((current) => ({ ...current, loading: true }))
    try {
      const response = await fetch("/api/google-analytics/test", { cache: "no-store" })
      const json = await response.json()
      setStatus({
        loading: false,
        configured: !!json.configured,
        connected: !!json.connected,
        error: json.error,
        account: json.account,
        activeUsers7d: json.activeUsers7d,
      })
    } catch {
      setStatus({ loading: false, configured: false, connected: false, error: "Falha ao verificar conexão" })
    }
  }, [])

  useEffect(() => {
    void checkStatus()
  }, [checkStatus])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connected = params.get("connected")
    const error = params.get("error")

    if (connected === "google_analytics") {
      setTab("integration")
      setNotice({ type: "success", message: "Google Analytics conectado com sucesso. Já estamos validando sua propriedade GA4." })
      return
    }

    if (error) {
      setTab("integration")
      setNotice({ type: "error", message: error })
    }
  }, [])

  const isConnected = status.connected

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketing">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
          <h1 className="flex items-center text-2xl font-bold md:text-3xl">
            <Activity className="mr-2 h-6 w-6 shrink-0 text-[#F4B400]" />
            Google Analytics
          </h1>
          <p className="text-muted-foreground">Analise o desempenho do seu site com Google Analytics 4</p>
        </div>
        <div className="shrink-0">
          {status.loading ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
          <TabsList className="grid w-max min-w-full grid-cols-7">
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
          <AnalyticsIntegration status={status} onRecheck={checkStatus} notice={notice} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
