"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, AlertTriangle, Facebook, BarChart4, LineChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MarketingHeaderProps {
  integrations: {
    facebook: boolean
    googleAds: boolean
    googleAnalytics: boolean
  }
}

export function MarketingHeader({ integrations }: MarketingHeaderProps) {
  const anyConnected = Object.values(integrations).some((status) => status)
  const allConnected = Object.values(integrations).every((status) => status)

  const connectedCount = Object.values(integrations).filter((status) => status).length
  const totalPlatforms = Object.keys(integrations).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Análise e otimização de campanhas de marketing</p>
        </div>

        <div className="flex items-center gap-2">
          {anyConnected ? (
            <>
              <Badge
                variant="outline"
                className={`${allConnected ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"}`}
              >
                {connectedCount}/{totalPlatforms} Plataformas Conectadas
              </Badge>
              <Button size="sm" variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Atualizar Dados
              </Button>
            </>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Nenhuma plataforma conectada
            </Badge>
          )}
        </div>
      </div>

      {!anyConnected && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              <p>Conecte-se às plataformas de marketing para sincronizar suas campanhas e métricas.</p>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2 whitespace-nowrap" variant="outline" onClick={() => {}}>
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button className="gap-2 whitespace-nowrap" variant="outline" onClick={() => {}}>
                <BarChart4 className="h-4 w-4" />
                Google Ads
              </Button>
              <Button className="gap-2 whitespace-nowrap" variant="outline" onClick={() => {}}>
                <LineChart className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {anyConnected && !allConnected && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-start gap-2 text-blue-700 dark:text-blue-400">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <p>Algumas plataformas ainda não estão conectadas:</p>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  {!integrations.facebook && <li>Facebook Ads</li>}
                  {!integrations.googleAds && <li>Google Ads</li>}
                  {!integrations.googleAnalytics && <li>Google Analytics</li>}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {!integrations.facebook && (
                <Button className="gap-2 whitespace-nowrap" variant="outline" size="sm" onClick={() => {}}>
                  <Facebook className="h-4 w-4" />
                  Conectar Facebook
                </Button>
              )}
              {!integrations.googleAds && (
                <Button className="gap-2 whitespace-nowrap" variant="outline" size="sm" onClick={() => {}}>
                  <BarChart4 className="h-4 w-4" />
                  Conectar Google Ads
                </Button>
              )}
              {!integrations.googleAnalytics && (
                <Button className="gap-2 whitespace-nowrap" variant="outline" size="sm" onClick={() => {}}>
                  <LineChart className="h-4 w-4" />
                  Conectar Analytics
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
