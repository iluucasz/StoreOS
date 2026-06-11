"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

const cashFlowData = [
  { mes: "Jan", entradas: 18500, saidas: 11200, saldo: 7300 },
  { mes: "Fev", entradas: 21000, saidas: 12800, saldo: 15500 },
  { mes: "Mar", entradas: 19800, saidas: 11600, saldo: 23700 },
  { mes: "Abr", entradas: 24500, saidas: 14200, saldo: 34000 },
  { mes: "Mai", entradas: 28000, saidas: 16500, saldo: 45500 },
  { mes: "Jun", entradas: 26500, saidas: 15300, saldo: 56700 },
]

const cashFlowLines = [
  { desc: "Vendas — Shopify", type: "entrada", value: 18200, category: "Vendas" },
  { desc: "Vendas — Marketplace", type: "entrada", value: 5400, category: "Vendas" },
  { desc: "Desconto de duplicatas", type: "entrada", value: 2900, category: "Financeiro" },
  { desc: "Compra de estoque — Confecções BR", type: "saida", value: 4200, category: "Estoque" },
  { desc: "Meta Ads — fatura Jun", type: "saida", value: 4200, category: "Marketing" },
  { desc: "Google Ads — fatura Jun", type: "saida", value: 2100, category: "Marketing" },
  { desc: "Frete e logística", type: "saida", value: 1200, category: "Operacional" },
  { desc: "Shopify + apps", type: "saida", value: 149, category: "SaaS" },
  { desc: "Impostos (DAS/IRPJ)", type: "saida", value: 1590, category: "Fiscal" },
  { desc: "Folha de pagamento", type: "saida", value: 1860, category: "RH" },
] as const

const totalEntradas = cashFlowLines.filter((l) => l.type === "entrada").reduce((s, l) => s + l.value, 0)
const totalSaidas = cashFlowLines.filter((l) => l.type === "saida").reduce((s, l) => s + l.value, 0)
const saldoAtual = totalEntradas - totalSaidas

export function CashFlow() {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Entradas (Jun)</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalEntradas)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Saídas (Jun)</p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(totalSaidas)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Saldo Líquido</p>
                <p className={`text-xl font-bold ${saldoAtual >= 0 ? "text-emerald-600" : "text-red-500"}`}>{formatCurrency(saldoAtual)}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa — Últimos 6 Meses</CardTitle>
          <CardDescription>Entradas, saídas e saldo acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-52 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="bar" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="line" orientation="right" tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                <Legend />
                <Bar yAxisId="bar" dataKey="entradas" fill="#34d399" name="Entradas" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="bar" dataKey="saidas" fill="#f87171" name="Saídas" radius={[3, 3, 0, 0]} />
                <Line yAxisId="line" type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} name="Saldo Acumulado" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lançamentos — Junho 2026</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Descrição</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Categoria</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowLines.map((line, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${line.type === "entrada" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {line.desc}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground hidden sm:table-cell">{line.category}</td>
                    <td className={`px-4 py-2.5 text-right font-medium tabular-nums ${line.type === "entrada" ? "text-emerald-600" : "text-red-500"}`}>
                      {line.type === "entrada" ? "+" : "−"}{formatCurrency(line.value)}
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
