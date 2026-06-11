"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

// Importar Recharts dinamicamente para evitar problemas de SSR
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const ReferenceLine = dynamic(() => import("recharts").then((mod) => mod.ReferenceLine), { ssr: false })

interface ProfitProjectionProps {
  productCost: number
  sellingPrice: number
  shippingCost: number
  packagingCost: number
  paymentFeePercentage: number
  marketingBudget: number
  marketingPeriod: string
}

export function ProfitProjection({
  productCost,
  sellingPrice,
  shippingCost,
  packagingCost,
  paymentFeePercentage,
  marketingBudget,
  marketingPeriod,
}: ProfitProjectionProps) {
  const { theme } = useTheme()
  const [minQuantity, setMinQuantity] = useState(1)
  const [maxQuantity, setMaxQuantity] = useState(50)
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [breakEvenPoint, setBreakEvenPoint] = useState(0)
  const [optimalPoint, setOptimalPoint] = useState(0)
  const [chartReady, setChartReady] = useState(false)

  // Ajustar orçamento de marketing com base no período
  const getAdjustedMarketingBudget = () => {
    if (marketingPeriod === "daily") {
      return marketingBudget * 30 // Aproximadamente um mês
    } else if (marketingPeriod === "weekly") {
      return marketingBudget * 4 // Aproximadamente um mês
    }
    return marketingBudget
  }

  // Calcular dados de projeção
  useEffect(() => {
    // Garantir que os valores são válidos
    if (
      isNaN(productCost) ||
      isNaN(sellingPrice) ||
      isNaN(shippingCost) ||
      isNaN(packagingCost) ||
      isNaN(paymentFeePercentage) ||
      isNaN(marketingBudget)
    ) {
      return
    }

    const adjustedMarketingBudget = getAdjustedMarketingBudget()
    const data = []

    // Calcular custo fixo total
    const fixedCosts = shippingCost + adjustedMarketingBudget

    // Calcular custo variável por unidade
    const variableCostPerUnit = productCost + packagingCost

    // Calcular taxa de pagamento por unidade
    const paymentFeePerUnit = sellingPrice * (paymentFeePercentage / 100)

    // Calcular margem de contribuição por unidade
    const contributionMargin = sellingPrice - variableCostPerUnit - paymentFeePerUnit

    // Calcular ponto de equilíbrio
    let breakEven = 0
    if (contributionMargin > 0) {
      breakEven = Math.ceil(fixedCosts / contributionMargin)
    } else {
      breakEven = maxQuantity // Se a margem de contribuição for negativa, não há ponto de equilíbrio
    }
    setBreakEvenPoint(breakEven)

    // Calcular ponto ótimo (onde o ROI é máximo)
    // Para simplificar, vamos definir como 2x o ponto de equilíbrio
    const optimal = Math.ceil(breakEven * 2)
    setOptimalPoint(optimal)

    // Ajustar maxQuantity se necessário
    if (optimal > maxQuantity) {
      setMaxQuantity(optimal * 1.5)
    }

    // Gerar dados para o gráfico
    for (let qty = minQuantity; qty <= maxQuantity; qty++) {
      const totalRevenue = qty * sellingPrice
      const totalVariableCost = qty * variableCostPerUnit
      const totalPaymentFees = qty * paymentFeePerUnit
      const totalCost = fixedCosts + totalVariableCost + totalPaymentFees
      const profit = totalRevenue - totalCost
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0

      data.push({
        quantity: qty,
        revenue: totalRevenue,
        cost: totalCost,
        profit: profit,
        roi: roi,
      })
    }

    setProjectionData(data)
    setChartReady(true)
  }, [
    productCost,
    sellingPrice,
    shippingCost,
    packagingCost,
    paymentFeePercentage,
    marketingBudget,
    marketingPeriod,
    minQuantity,
    maxQuantity,
  ])

  // Formatar valores para o tooltip
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  // Componente personalizado para o tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label} unidades`}</p>
          <p className="text-sm text-blue-500">{`Receita: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-sm text-red-500">{`Custo: ${formatCurrency(payload[1].value)}`}</p>
          <p className={`text-sm ${payload[2].value >= 0 ? "text-green-500" : "text-red-500"}`}>
            {`Lucro: ${formatCurrency(payload[2].value)}`}
          </p>
          <p className={`text-sm ${payload[3]?.value >= 0 ? "text-green-500" : "text-red-500"}`}>
            {`ROI: ${payload[3]?.value?.toFixed(1) || 0}%`}
          </p>
        </div>
      )
    }
    return null
  }

  // Calcular o ROI máximo
  const getMaxRoi = () => {
    if (projectionData.length === 0) return 0
    const rois = projectionData.map((d) => d.roi).filter((roi) => isFinite(roi) && !isNaN(roi))
    return rois.length > 0 ? Math.max(...rois) : 0
  }

  // Calcular o lucro no ponto ótimo
  const getOptimalProfit = () => {
    if (projectionData.length === 0 || optimalPoint <= 0) return 0
    const optimalData = projectionData.find((d) => d.quantity === optimalPoint)
    return optimalData ? optimalData.profit : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção de Lucro por Quantidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="min-quantity">Quantidade Mínima</Label>
            <Input
              id="min-quantity"
              type="number"
              min="1"
              max={maxQuantity - 1}
              value={minQuantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value >= 1 && value < maxQuantity) {
                  setMinQuantity(value)
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-quantity">Quantidade Máxima</Label>
            <Input
              id="max-quantity"
              type="number"
              min={minQuantity + 1}
              value={maxQuantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value) && value > minQuantity) {
                  setMaxQuantity(value)
                }
              }}
            />
          </div>
        </div>

        <div className="h-80">
          {chartReady && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
                <XAxis
                  dataKey="quantity"
                  label={{ value: "Quantidade", position: "insideBottomRight", offset: -5 }}
                  stroke={theme === "dark" ? "#888" : "#333"}
                />
                <YAxis tickFormatter={formatTooltipValue} stroke={theme === "dark" ? "#888" : "#333"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {breakEvenPoint > 0 && (
                  <ReferenceLine
                    x={breakEvenPoint}
                    stroke="#ff7300"
                    label={{
                      value: "Break-even",
                      position: "top",
                      fill: theme === "dark" ? "#fff" : "#000",
                      fontSize: 12,
                    }}
                  />
                )}
                {optimalPoint > 0 && (
                  <ReferenceLine
                    x={optimalPoint}
                    stroke="#82ca9d"
                    label={{
                      value: "Ótimo",
                      position: "top",
                      fill: theme === "dark" ? "#fff" : "#000",
                      fontSize: 12,
                    }}
                  />
                )}
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cost" name="Custo" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" name="Lucro" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="roi"
                  name="ROI (%)"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  yAxisId={1}
                  hide={true} // Escondido por padrão, mas usado no tooltip
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium">Ponto de Equilíbrio</p>
                <p className="text-xl mt-1">{breakEvenPoint} unidades</p>
                <p className="text-xs text-muted-foreground mt-1">Lucro: {formatCurrency(0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium">Ponto Ótimo</p>
                <p className="text-xl mt-1">{optimalPoint} unidades</p>
                <p className="text-xs text-muted-foreground mt-1">Lucro: {formatCurrency(getOptimalProfit())}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium">ROI Máximo</p>
                <p className="text-xl mt-1">{getMaxRoi().toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Retorno sobre investimento máximo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Análise de Cenários</h3>
          <div className="text-sm space-y-2">
            <p>
              <strong>Cenário de Prejuízo:</strong> Abaixo de {breakEvenPoint} unidades, você terá prejuízo.
            </p>
            <p>
              <strong>Cenário de Equilíbrio:</strong> Com exatamente {breakEvenPoint} unidades, você cobrirá todos os
              custos sem lucro.
            </p>
            <p>
              <strong>Cenário Lucrativo:</strong> Entre {breakEvenPoint} e {optimalPoint} unidades, você terá lucro
              crescente.
            </p>
            <p>
              <strong>Cenário Ótimo:</strong> Com {optimalPoint} unidades ou mais, você maximizará seu ROI e lucro.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
