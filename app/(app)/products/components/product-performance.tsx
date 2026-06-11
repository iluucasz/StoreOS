"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Eye, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react"

const mockPerformance = [
  {
    id: 1,
    name: "Conjunto Verão",
    price: 139.9,
    margin: 38,
    stock: 5,
    views: 3200,
    sales: 142,
    cartAdds: 480,
    abandoned: 338,
  },
  {
    id: 2,
    name: "Vestido Casual",
    price: 149.9,
    margin: 40,
    stock: 8,
    views: 2850,
    sales: 98,
    cartAdds: 310,
    abandoned: 212,
  },
  {
    id: 3,
    name: "Calça Jeans",
    price: 129.9,
    margin: 35,
    stock: 10,
    views: 2100,
    sales: 87,
    cartAdds: 260,
    abandoned: 173,
  },
  {
    id: 4,
    name: "Blusa Feminina",
    price: 89.9,
    margin: 30,
    stock: 15,
    views: 1750,
    sales: 65,
    cartAdds: 198,
    abandoned: 133,
  },
  {
    id: 5,
    name: "Saia Midi",
    price: 79.9,
    margin: 32,
    stock: 12,
    views: 980,
    sales: 34,
    cartAdds: 120,
    abandoned: 86,
  },
]

function RankRow({
  rank,
  name,
  price,
  margin,
  stock,
  metric,
  metricLabel,
  badge,
}: {
  rank: number
  name: string
  price: number
  margin: number
  stock: number
  metric: number
  metricLabel: string
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{name}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-muted-foreground">{formatCurrency(price)}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Margem {margin}%</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Estoque {stock}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold">{metric.toLocaleString("pt-BR")}</div>
        <div className="text-xs text-muted-foreground">{metricLabel}</div>
      </div>
    </div>
  )
}

export function ProductPerformance() {
  const byViews = [...mockPerformance].sort((a, b) => b.views - a.views)
  const bySales = [...mockPerformance].sort((a, b) => b.sales - a.sales)
  const byCart = [...mockPerformance].sort((a, b) => b.cartAdds - a.cartAdds)
  const byAbandoned = [...mockPerformance].sort((a, b) => b.abandoned - a.abandoned)

  return (
    <Card className="mb-6">
      <Tabs defaultValue="vendidos">
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Performance de Produtos</h2>
          </div>
          <div className="overflow-x-auto">
            <TabsList className="mb-0 w-max min-w-full">
              <TabsTrigger value="vendidos" className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Mais </span>Vendidos
              </TabsTrigger>
              <TabsTrigger value="vistos" className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xs:inline">Mais </span>Vistos
              </TabsTrigger>
              <TabsTrigger value="carrinho" className="flex items-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Mais no </span>Carrinho
              </TabsTrigger>
              <TabsTrigger value="abandonados" className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Mais </span>Abandonados
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <CardContent className="pt-2">
          <TabsContent value="vendidos" className="mt-0">
            {bySales.map((p, i) => (
              <RankRow
                key={p.id}
                rank={i + 1}
                name={p.name}
                price={p.price}
                margin={p.margin}
                stock={p.stock}
                metric={p.sales}
                metricLabel="vendas"
                badge={i === 0 ? "🏆 Top vendedor" : undefined}
              />
            ))}
          </TabsContent>

          <TabsContent value="vistos" className="mt-0">
            {byViews.map((p, i) => (
              <RankRow
                key={p.id}
                rank={i + 1}
                name={p.name}
                price={p.price}
                margin={p.margin}
                stock={p.stock}
                metric={p.views}
                metricLabel="visualizações"
                badge={i === 0 ? "👁️ Mais visto" : undefined}
              />
            ))}
          </TabsContent>

          <TabsContent value="carrinho" className="mt-0">
            {byCart.map((p, i) => (
              <RankRow
                key={p.id}
                rank={i + 1}
                name={p.name}
                price={p.price}
                margin={p.margin}
                stock={p.stock}
                metric={p.cartAdds}
                metricLabel="adições ao carrinho"
                badge={i === 0 ? "🛒 Mais desejado" : undefined}
              />
            ))}
          </TabsContent>

          <TabsContent value="abandonados" className="mt-0">
            {byAbandoned.map((p, i) => (
              <RankRow
                key={p.id}
                rank={i + 1}
                name={p.name}
                price={p.price}
                margin={p.margin}
                stock={p.stock}
                metric={p.abandoned}
                metricLabel="carrinhos abandonados"
                badge={i === 0 ? "⚠️ Atenção" : undefined}
              />
            ))}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
