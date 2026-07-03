"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Activity, BarChart4 } from "lucide-react"
import { MetaIcon, TikTokIcon } from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketingDashboard, type PlatformStatuses } from "./components/marketing-dashboard"
import { MarketingHeader } from "./components/marketing-header"

const initialStatuses: PlatformStatuses = {
  meta: { loading: true, configured: false, connected: false },
  googleAds: { loading: true, configured: false, connected: false },
  tiktok: { loading: true, configured: false, connected: false },
  googleAnalytics: { loading: true, configured: false, connected: false },
}

const checks = [
  ["meta", "/api/meta-ads/test"],
  ["googleAds", "/api/google-ads/test"],
  ["tiktok", "/api/tiktok-ads/test"],
  ["googleAnalytics", "/api/google-analytics/test"],
] as const

export default function MarketingPage() {
  const [statuses, setStatuses] = useState<PlatformStatuses>(initialStatuses)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(async () => {
    setStatuses((current) => ({
      meta: { ...current.meta, loading: true },
      googleAds: { ...current.googleAds, loading: true },
      tiktok: { ...current.tiktok, loading: true },
      googleAnalytics: { ...current.googleAnalytics, loading: true },
    }))

    const results = await Promise.all(
      checks.map(async ([key, path]) => {
        try {
          const response = await fetch(path, { cache: "no-store" })
          const json = await response.json()
          return [
            key,
            {
              loading: false,
              configured: !!json.configured,
              connected: !!json.connected,
              error: json.error,
              account: json.account,
            },
          ] as const
        } catch {
          return [
            key,
            {
              loading: false,
              configured: false,
              connected: false,
              error: "Não foi possível verificar a integração.",
            },
          ] as const
        }
      }),
    )

    setStatuses((current) => {
      const next = { ...current }
      for (const [key, value] of results) next[key] = value
      return next
    })
    setRefreshKey((value) => value + 1)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const integrations = useMemo(
    () => ({
      meta: statuses.meta.connected,
      googleAds: statuses.googleAds.connected,
      tiktok: statuses.tiktok.connected,
      googleAnalytics: statuses.googleAnalytics.connected,
    }),
    [statuses],
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <MarketingHeader statuses={statuses} onRefresh={refresh} />

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IntegrationCard
            title="Meta Ads"
            description="Facebook e Instagram Ads"
            body="Acompanhe campanhas, demografia e conversões dos seus anúncios no Facebook e Instagram."
            href="/marketing/facebook"
            action="Acessar Meta Ads"
            connected={statuses.meta.connected}
            icon={<MetaIcon className="mr-2 h-5 w-5 text-[#0866FF]" />}
          />

          <IntegrationCard
            title="TikTok Ads"
            description="Campanhas no TikTok"
            body="Acompanhe desempenho, gasto e conversões dos seus anúncios no TikTok Ads."
            href="/marketing/tiktok"
            action="Acessar TikTok Ads"
            connected={statuses.tiktok.connected}
            icon={<TikTokIcon className="mr-2 h-5 w-5" />}
          />

          <IntegrationCard
            title="Google Ads"
            description="Campanhas no Google"
            body="Gerencie campanhas de pesquisa, display e vídeo com dados reais da conta."
            href="/marketing/google/ads"
            action="Acessar Google Ads"
            connected={statuses.googleAds.connected}
            icon={<BarChart4 className="mr-2 h-5 w-5 text-[#DB4437]" />}
          />

          <IntegrationCard
            title="Google Analytics"
            description="Desempenho do site"
            body="Acompanhe tráfego, comportamento dos usuários, conversões e e-commerce no GA4."
            href="/marketing/google/analytics"
            action="Acessar Analytics"
            connected={statuses.googleAnalytics.connected}
            icon={<Activity className="mr-2 h-5 w-5 text-[#F4B400]" />}
          />
        </div>

        <MarketingDashboard integrations={integrations} statuses={statuses} refreshKey={refreshKey} />
      </div>
    </div>
  )
}

function IntegrationCard({
  title,
  description,
  body,
  href,
  action,
  connected,
  icon,
}: {
  title: string
  description: string
  body: string
  href: string
  action: string
  connected: boolean
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-base">
              {icon}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <span
            className={
              connected
                ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600"
                : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            }
          >
            {connected ? "Conectado" : "Pendente"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{body}</p>
        <Button asChild className="w-full">
          <Link href={href}>{action}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
