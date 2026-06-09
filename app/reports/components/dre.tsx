"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { downloadCSV } from "@/lib/export-csv"

interface DRELine {
  label: string
  value: number
  pct?: number
  change?: number
  indent?: boolean
  bold?: boolean
  separator?: boolean
  positive?: boolean
}

const receitaBruta = 26500
const devolucoes = 800
const receitaLiquida = receitaBruta - devolucoes
const cmv = 6700
const lucroBruto = receitaLiquida - cmv
const marketing = 6300
const freteLogistica = 1200
const taxasPlataforma = 530
const impostos = 1590
const lucroOperacional = lucroBruto - marketing - freteLogistica - taxasPlataforma - impostos

function pct(val: number) {
  return Math.round((val / receitaBruta) * 1000) / 10
}

const dreLines: DRELine[] = [
  { label: "Receita Bruta", value: receitaBruta, pct: 100, change: 8.2, bold: true },
  { label: "(−) Devoluções e Cancelamentos", value: -devolucoes, pct: pct(devolucoes), change: 2.1, indent: true },
  { label: "= Receita Líquida", value: receitaLiquida, pct: pct(receitaLiquida), change: 7.8, bold: true, separator: true },
  { label: "(−) Custo dos Produtos (CMV)", value: -cmv, pct: pct(cmv), change: -1.2, indent: true },
  { label: "= Lucro Bruto", value: lucroBruto, pct: pct(lucroBruto), change: 10.5, bold: true, separator: true, positive: true },
  { label: "(−) Marketing / Ads", value: -marketing, pct: pct(marketing), change: 5.2, indent: true },
  { label: "(−) Frete e Logística", value: -freteLogistica, pct: pct(freteLogistica), change: -0.8, indent: true },
  { label: "(−) Taxas de Plataforma", value: -taxasPlataforma, pct: pct(taxasPlataforma), change: 0.5, indent: true },
  { label: "(−) Impostos", value: -impostos, pct: pct(impostos), change: 8.3, indent: true },
  { label: "= Lucro Operacional (EBIT)", value: lucroOperacional, pct: pct(lucroOperacional), change: 7.6, bold: true, separator: true, positive: true },
]

function DRERow({ line }: { line: DRELine }) {
  const isNeg = line.value < 0
  const displayValue = Math.abs(line.value)

  return (
    <>
      {line.separator && <tr className="h-px"><td colSpan={4} className="bg-border" /></tr>}
      <tr className={`${line.bold ? "bg-muted/30" : "hover:bg-muted/20"} transition-colors`}>
        <td className={`px-4 py-2.5 text-sm ${line.indent ? "pl-8 text-muted-foreground" : ""} ${line.bold ? "font-semibold" : ""}`}>
          {line.label}
        </td>
        <td className={`px-3 py-2.5 text-right tabular-nums text-sm ${line.bold ? "font-semibold" : ""} ${isNeg ? "text-red-500" : line.positive ? "text-emerald-600" : ""}`}>
          {isNeg ? `(${formatCurrency(displayValue)})` : formatCurrency(displayValue)}
        </td>
        <td className="px-3 py-2.5 text-right text-xs text-muted-foreground hidden sm:table-cell">
          {line.pct !== undefined ? `${line.pct}%` : ""}
        </td>
        <td className="px-4 py-2.5 hidden md:table-cell">
          {line.change !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs justify-end ${line.change >= 0 && !isNeg ? "text-emerald-600" : line.change < 0 && isNeg ? "text-emerald-600" : "text-red-500"}`}>
              {line.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(line.change)}%
            </span>
          )}
        </td>
      </tr>
    </>
  )
}

export function DRE() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>DRE — Demonstração do Resultado</CardTitle>
            <CardDescription>Junho 2026 · comparado com maio 2026</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2"
            onClick={() => downloadCSV("dre-junho-2026.csv", dreLines.filter(l => !l.separator).map(l => ({
              "Linha": l.label,
              "Valor (R$)": l.value,
              "% Receita": l.pct ?? "",
              "Variação (%)": l.change ?? "",
            })))}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Linha</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">% Receita</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Var.</th>
              </tr>
            </thead>
            <tbody>
              {dreLines.map((line, i) => (
                <DRERow key={i} line={line} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div className="border-t border-border p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Margem Bruta</p>
            <p className="text-lg font-bold text-emerald-600">{pct(lucroBruto)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margem Operacional</p>
            <p className="text-lg font-bold text-emerald-600">{pct(lucroOperacional)}%</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Lucro Operacional</p>
            <p className="text-lg font-bold">{formatCurrency(lucroOperacional)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
