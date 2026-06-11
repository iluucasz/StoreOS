"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { RefreshCw, TrendingUp, Users, UserX } from "lucide-react"
import { type LucideIcon } from "lucide-react"

// ─── KPI ─────────────────────────────────────────────────────────────────────

function Kpi({ title, value, icon: Icon, sub }: { title: string; value: string; icon: LucideIcon; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Cohort data ──────────────────────────────────────────────────────────────

const cohorts = [
  { month: "Jan/26", total: 42, w1: 78, w2: 62, w4: 48, w8: 31 },
  { month: "Fev/26", total: 38, w1: 74, w2: 58, w4: 45, w8: 28 },
  { month: "Mar/26", total: 51, w1: 82, w2: 65, w4: 52, w8: 35 },
  { month: "Abr/26", total: 47, w1: 79, w2: 60, w4: 49, w8: null },
  { month: "Mai/26", total: 63, w1: 85, w2: 68, w4: null, w8: null },
  { month: "Jun/26", total: 29, w1: 76, w2: null, w4: null, w8: null },
]

function pctColor(v: number | null) {
  if (v === null) return "text-muted-foreground bg-muted/30"
  if (v >= 70) return "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
  if (v >= 50) return "text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
  return "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
}

// ─── Segments ────────────────────────────────────────────────────────────────

const segments = [
  { label: "Novos", desc: "1ª compra nos últimos 30 dias", count: 29, value: 4200, color: "bg-blue-500" },
  { label: "Recorrentes", desc: "2+ compras no histórico", count: 85, value: 18700, color: "bg-emerald-500" },
  { label: "Em Risco", desc: "Sem compra há 31–90 dias", count: 23, value: 5100, color: "bg-yellow-500" },
  { label: "Churned", desc: "Sem compra há +90 dias", count: 12, value: 2800, color: "bg-red-500" },
]

const totalSegments = segments.reduce((s, g) => s + g.count, 0)

// ─── Top customers ────────────────────────────────────────────────────────────

const topCustomers = [
  { name: "Camila Rocha", totalSpent: 1289.1, orders: 3, ltv: 2150, lastOrder: "2026-06-03" },
  { name: "Ana Lima", totalSpent: 689.8, orders: 2, ltv: 1380, lastOrder: "2026-06-08" },
  { name: "Mariana Santos", totalSpent: 449.8, orders: 2, ltv: 900, lastOrder: "2026-06-06" },
  { name: "Carlos Mendes", totalSpent: 389.7, orders: 1, ltv: 780, lastOrder: "2026-06-07" },
  { name: "Roberto Alves", totalSpent: 259.8, orders: 1, ltv: 520, lastOrder: "2026-06-05" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RetentionPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Retenção</h1>
      <p className="text-sm text-muted-foreground mb-6">LTV, taxa de recompra e saúde da base de clientes</p>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <Kpi title="LTV Médio" value={formatCurrency(980)} icon={TrendingUp} sub="por cliente" />
        <Kpi title="Taxa de Recompra" value="57%" icon={RefreshCw} sub="clientes recorrentes" />
        <Kpi title="Ativos (30d)" value="85" icon={Users} sub="compraram recentemente" />
        <Kpi title="Churn Rate" value="8%" icon={UserX} sub="ao mês" />
      </div>

      {/* Cohort */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Análise de Coorte</CardTitle>
          <CardDescription>% de clientes retidos semanas após a primeira compra</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Coorte</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Clientes</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Sem. 1</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Sem. 2</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Sem. 4</th>
                  <th className="text-center px-3 py-2 font-medium text-muted-foreground">Sem. 8</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.month} className="border-b border-border/50">
                    <td className="px-3 py-2 font-medium">{c.month}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{c.total}</td>
                    {[c.w1, c.w2, c.w4, c.w8].map((v, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${pctColor(v)}`}>
                          {v !== null ? `${v}%` : "—"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Segments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Segmentos de Clientes</CardTitle>
          <CardDescription>Distribuição da base por engajamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((seg) => {
              const pct = Math.round((seg.count / totalSegments) * 100)
              return (
                <div key={seg.label} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
                    <span className="font-semibold text-sm">{seg.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{seg.desc}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-xl">{seg.count}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${seg.color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{formatCurrency(seg.value)} em receita</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes por LTV</CardTitle>
          <CardDescription>Clientes com maior valor de tempo de vida estimado</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">#</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Total Gasto</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Pedidos</th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">LTV est.</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden lg:table-cell">Último Pedido</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={c.name} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-muted-foreground font-medium">#{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium">{c.name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{formatCurrency(c.totalSpent)}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{c.orders}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-emerald-600 font-medium hidden md:table-cell">{formatCurrency(c.ltv)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground hidden lg:table-cell">
                      {new Date(c.lastOrder).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
