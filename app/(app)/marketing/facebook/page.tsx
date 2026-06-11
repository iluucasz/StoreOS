"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { MetaIcon } from "@/components/brand-icons"
import { FacebookDashboard } from "./components/facebook-dashboard"
import { FacebookCampaigns } from "./components/facebook-campaigns"
import { FacebookAudiences } from "./components/facebook-audiences"
import { FacebookPixel } from "./components/facebook-pixel"
import { FacebookIntegration } from "./components/facebook-integration"
import Link from "next/link"

export type MetaStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
  account?: { name?: string; currency?: string } | null
}

export default function MetaAdsPage() {
  const [tab, setTab] = useState("dashboard")
  const [status, setStatus] = useState<MetaStatus>({ loading: true, configured: false, connected: false })

  const checkStatus = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true }))
    try {
      const res = await fetch("/api/meta-ads/test", { cache: "no-store" })
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
            <MetaIcon className="mr-2 h-6 w-6 text-[#0866FF] shrink-0" />
            Meta Ads
          </h1>
          <p className="text-muted-foreground">
            {status.account?.name ? `Conta: ${status.account.name}` : "Facebook e Instagram Ads em uma tela"}
          </p>
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
              <MetaIcon className="mr-2 h-4 w-4" />
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
            <TabsTrigger value="audiences">Demografia</TabsTrigger>
            <TabsTrigger value="pixel">Conversões</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          <FacebookDashboard isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-6">
          <FacebookCampaigns isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="audiences" className="mt-6">
          <FacebookAudiences isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="pixel" className="mt-6">
          <FacebookPixel isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="integration" className="mt-6">
          <FacebookIntegration status={status} onRecheck={checkStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
