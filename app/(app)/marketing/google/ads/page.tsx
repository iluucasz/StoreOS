"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart4, Check, ArrowLeft, Loader2 } from "lucide-react"
import { GoogleAdsDashboard } from "./components/google-ads-dashboard"
import { GoogleAdsCampaigns } from "./components/google-ads-campaigns"
import { GoogleAdsKeywords } from "./components/google-ads-keywords"
import { GoogleAdsConversions } from "./components/google-ads-conversions"
import { GoogleAdsIntegration } from "./components/google-ads-integration"
import Link from "next/link"

export type GoogleAdsStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
  account?: { id: string; name?: string; currency?: string } | null
}

export default function GoogleAdsPage() {
  const [tab, setTab] = useState("dashboard")
  const [status, setStatus] = useState<GoogleAdsStatus>({ loading: true, configured: false, connected: false })

  const checkStatus = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true }))
    try {
      const res = await fetch("/api/google-ads/test", { cache: "no-store" })
      const json = await res.json()
      setStatus({
        loading: false,
        configured: !!json.configured,
        connected: !!json.connected,
        error: json.error,
        account: json.account,
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
            <BarChart4 className="mr-2 h-6 w-6 text-[#DB4437] shrink-0" />
            Google Ads
          </h1>
          <p className="text-muted-foreground">
            {status.account?.name
              ? `Conta: ${status.account.name}`
              : "Gerencie suas campanhas do Google Ads"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
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
              <BarChart4 className="mr-2 h-4 w-4" />
              Configurar integração
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <div className="overflow-x-auto">
          <TabsList className="w-max min-w-full grid grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            <TabsTrigger value="conversions">Conversões</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          <GoogleAdsDashboard isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <GoogleAdsCampaigns isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <GoogleAdsKeywords isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="conversions" className="mt-6">
          <GoogleAdsConversions isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <GoogleAdsIntegration status={status} onRecheck={checkStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
