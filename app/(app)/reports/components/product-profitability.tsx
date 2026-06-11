"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useProducts, getProductStock } from "@/contexts/products-context"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"

// Mock sales data per product id — units sold this month
const mockSales: Record<number, number> = {
  1: 22,
  2: 14,
  3: 18,
  4: 10,
  5: 16,
}

function marginClass(margin: number) {
  if (margin >= 40) return "text-emerald-600"
  if (margin >= 25) return "text-yellow-600"
  return "text-red-500"
}

function marginBadgeClass(margin: number) {
  if (margin >= 40) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  if (margin >= 25) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
}

function barColor(margin: number) {
  if (margin >= 40) return "#10b981"
  if (margin >= 25) return "#f59e0b"
  return "#ef4444"
}

export function ProductProfitability() {
  const { products } = useProducts()

  const rows = products
    .map((p) => {
      const unitsSold = mockSales[p.id] ?? Math.floor(Math.random() * 15) + 5
      const revenue = p.price * unitsSold
      const cost = p.cost * unitsSold
      const profit = revenue - cost
      const stock = getProductStock(p)
      return {
        id: p.id,
        name: p.name,
        cost: p.cost,
        price: p.price,
        margin: p.margin,
        unitsSold,
        revenue,
        profit,
        stock,
        variants: p.variants?.length ?? 0,
      }
    })
    .sort((a, b) => b.profit - a.profit)

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0)
  const totalProfit = rows.reduce((s, r) => s + r.profit, 0)
  const avgMargin = rows.length > 0 ? rows.reduce((s, r) => s + r.margin, 0) / rows.length : 0
  const topProduct = rows[0]

  const chartData = [...rows]
    .sort((a, b) => b.margin - a.margin)
    .map((r) => ({ name: r.name.split(" ").slice(0, 2).join(" "), margin: r.margin }))

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Receita Total</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">{rows.reduce((s, r) => s + r.unitsSold, 0)} unidades vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Lucro Total</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalProfit)}</p>
            <p className="text-xs text-muted-foreground">{Math.round((totalProfit / totalRevenue) * 100)}% da receita</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Margem Média</p>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className={`text-xl font-bold mt-1 ${marginClass(avgMargin)}`}>{avgMargin.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">sobre todos os produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Mais Lucrativo</p>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold mt-1 truncate">{topProduct?.name ?? "—"}</p>
            <p className="text-xs text-emerald-600">{topProduct ? formatCurrency(topProduct.profit) : "—"} de lucro</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Margem por Produto</CardTitle>
          <CardDescription>Verde ≥ 40% · Amarelo 25–40% · Vermelho &lt; 25%</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v ?? 0)}%`, "Margem"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.margin)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking de Rentabilidade</CardTitle>
          <CardDescription>Ordenado por lucro gerado no mês</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-8">#</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Produto</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Custo</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Preço</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Margem</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Vendidos</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Receita</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{r.name}</div>
                      {r.variants > 0 && (
                        <div className="text-xs text-muted-foreground">{r.variants} variantes · {r.stock} em estoque</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                      {formatCurrency(r.cost)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">
                      {formatCurrency(r.price)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${marginBadgeClass(r.margin)}`}>
                        {r.margin}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground hidden md:table-cell">
                      {r.unitsSold} un.
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">
                      {formatCurrency(r.revenue)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-emerald-600">
                      {formatCurrency(r.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/30">
                  <td colSpan={3} className="px-4 py-2.5 text-sm font-semibold hidden sm:table-cell">Total</td>
                  <td className="px-4 py-2.5 text-sm font-semibold sm:hidden">Total</td>
                  <td className="hidden sm:table-cell" />
                  <td className="hidden sm:table-cell" />
                  <td className="px-3 py-2.5 text-right text-sm font-semibold tabular-nums hidden md:table-cell">
                    {rows.reduce((s, r) => s + r.unitsSold, 0)} un.
                  </td>
                  <td className="px-3 py-2.5 text-right text-sm font-semibold tabular-nums hidden md:table-cell">
                    {formatCurrency(totalRevenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-emerald-600">
                    {formatCurrency(totalProfit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
