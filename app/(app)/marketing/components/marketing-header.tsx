"use client"

import Link from "next/link"
import { AlertTriangle, BarChart4, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { MetaIcon, TikTokIcon } from "@/components/brand-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PlatformStatuses } from "./marketing-dashboard"

const platformLinks = [
  { key: "meta", label: "Meta Ads", href: "/marketing/facebook", icon: MetaIcon },
  { key: "googleAds", label: "Google Ads", href: "/marketing/google/ads", icon: BarChart4 },
  { key: "tiktok", label: "TikTok Ads", href: "/marketing/tiktok", icon: TikTokIcon },
  { key: "googleAnalytics", label: "Analytics", href: "/marketing/google/analytics", icon: BarChart4 },
] as const

export function MarketingHeader({ statuses, onRefresh }: { statuses: PlatformStatuses; onRefresh: () => void }) {
  const values = Object.values(statuses)
  const loading = values.some((status) => status.loading)
  const connectedCount = values.filter((status) => status.connected).length
  const totalPlatforms = values.length
  const anyConnected = connectedCount > 0
  const allConnected = connectedCount === totalPlatforms
  const missing = platformLinks.filter((platform) => !statuses[platform.key].connected)

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">Análise real de campanhas, tráfego e conversões.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              allConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            }
          >
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Verificando
              </span>
            ) : (
              `${connectedCount}/${totalPlatforms} plataformas conectadas`
            )}
          </Badge>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => void onRefresh()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar dados
          </Button>
        </div>
      </div>

      {!anyConnected ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Conecte pelo menos uma plataforma para preencher esta visão com dados reais.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {platformLinks.map((platform) => (
                <Button key={platform.key} asChild className="gap-2 whitespace-nowrap" variant="outline" size="sm">
                  <Link href={platform.href}>
                    <platform.icon className="h-4 w-4" />
                    {platform.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !allConnected ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium">Dados reais carregados das integrações conectadas.</p>
                <p className="text-sm text-muted-foreground">
                  Ainda falta conectar: {missing.map((platform) => platform.label).join(", ")}.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {missing.map((platform) => (
                <Button key={platform.key} asChild className="gap-2 whitespace-nowrap" variant="outline" size="sm">
                  <Link href={platform.href}>
                    <platform.icon className="h-4 w-4" />
                    Conectar {platform.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
