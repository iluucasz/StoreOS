"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Eye, ShoppingCart, TrendingUp } from "lucide-react"
import { EmptyState, ErrorState, IntegrationRequired, LoadingState } from "@/components/feedback-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

type ProductMetrics = {
  name: string
  views: number
  cartAdds: number
  purchases: number
  abandoned: number
  revenue: number
  avgPrice: number
}

type ProductsAnalyticsResponse = {
  configured?: boolean
  items?: ProductMetrics[]
  error?: string
}

function RankRow({
  rank,
  name,
  avgPrice,
  revenue,
  metric,
  metricLabel,
  badge,
}: {
  rank: number
  name: string
  avgPrice: number
  revenue: number
  metric: number
  metricLabel: string
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium">{name}</span>
            {badge && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-3">
            {avgPrice > 0 && <span className="text-xs text-muted-foreground">{formatCurrency(avgPrice)}</span>}
            {revenue > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:inline">Receita {formatCurrency(revenue)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold">{metric.toLocaleString("pt-BR")}</div>
        <div className="text-xs text-muted-foreground">{metricLabel}</div>
      </div>
    </div>
  )
}

async function readJson(response: Response): Promise<ProductsAnalyticsResponse> {
  try {
    return await response.json()
  } catch {
    return { error: "Resposta inesperada do servidor." }
  }
}

export function ProductPerformance() {
  const [items, setItems] = useState<ProductMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/google-analytics/products", { cache: "no-store" })
      const json = await readJson(response)

      if (json.configured === false) {
        setConfigured(false)
        setItems([])
        return
      }

      setConfigured(true)

      if (!response.ok || json.error) {
        setError(json.error || "Não foi possível carregar a performance dos produtos.")
        setItems([])
        return
      }

      setItems(json.items ?? [])
    } catch {
      setError("Não foi possível conectar ao Google Analytics agora.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  const top = (key: keyof ProductMetrics) =>
    [...items].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 10)

  return (
    <Card className="mb-6">
      <Tabs defaultValue="vendidos">
        <div className="px-6 pb-0 pt-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold">Performance de produtos</h2>
            <span className="text-xs text-muted-foreground">Google Analytics, últimos 30 dias</span>
          </div>
          <div className="overflow-x-auto">
            <TabsList className="mb-0 w-max min-w-full">
              <TabsTrigger value="vendidos" className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                Vendidos
              </TabsTrigger>
              <TabsTrigger value="vistos" className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 shrink-0" />
                Vistos
              </TabsTrigger>
              <TabsTrigger value="carrinho" className="flex items-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                Carrinho
              </TabsTrigger>
              <TabsTrigger value="abandonados" className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Abandonados
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <CardContent className="pt-2">
          {loading ? (
            <LoadingState label="Carregando performance..." />
          ) : !configured ? (
            <IntegrationRequired
              service="Google Analytics"
              description="Conecte o GA4 para acompanhar visualizações, carrinhos, vendas e abandono por produto."
            />
          ) : error ? (
            <ErrorState description={error} onAction={() => void loadItems()} />
          ) : items.length === 0 ? (
            <EmptyState
              title="Sem eventos de produto"
              description="Ainda não existem eventos do GA4 para produtos nos últimos 30 dias."
            />
          ) : (
            <>
              <TabsContent value="vendidos" className="mt-0">
                {top("purchases").map((product, index) => (
                  <RankRow
                    key={product.name}
                    rank={index + 1}
                    name={product.name}
                    avgPrice={product.avgPrice}
                    revenue={product.revenue}
                    metric={product.purchases}
                    metricLabel="vendas"
                    badge={index === 0 ? "Top" : undefined}
                  />
                ))}
              </TabsContent>
              <TabsContent value="vistos" className="mt-0">
                {top("views").map((product, index) => (
                  <RankRow
                    key={product.name}
                    rank={index + 1}
                    name={product.name}
                    avgPrice={product.avgPrice}
                    revenue={product.revenue}
                    metric={product.views}
                    metricLabel="visualizações"
                    badge={index === 0 ? "Mais visto" : undefined}
                  />
                ))}
              </TabsContent>
              <TabsContent value="carrinho" className="mt-0">
                {top("cartAdds").map((product, index) => (
                  <RankRow
                    key={product.name}
                    rank={index + 1}
                    name={product.name}
                    avgPrice={product.avgPrice}
                    revenue={product.revenue}
                    metric={product.cartAdds}
                    metricLabel="adições"
                    badge={index === 0 ? "Desejado" : undefined}
                  />
                ))}
              </TabsContent>
              <TabsContent value="abandonados" className="mt-0">
                {top("abandoned").map((product, index) => (
                  <RankRow
                    key={product.name}
                    rank={index + 1}
                    name={product.name}
                    avgPrice={product.avgPrice}
                    revenue={product.revenue}
                    metric={product.abandoned}
                    metricLabel="abandonos"
                    badge={index === 0 ? "Atenção" : undefined}
                  />
                ))}
              </TabsContent>
            </>
          )}
        </CardContent>
      </Tabs>
    </Card>
  )
}
