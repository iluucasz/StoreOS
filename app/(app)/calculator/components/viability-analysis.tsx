"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface ViabilityAnalysisProps {
  productCost: number
  sellingPrice: number
  profitPerItem: number
  quantity: number
  totalProfit: number
  roi: number
  breakEvenQuantity: number
}

export function ViabilityAnalysis({
  productCost,
  sellingPrice,
  profitPerItem,
  quantity,
  totalProfit,
  roi,
  breakEvenQuantity,
}: ViabilityAnalysisProps) {
  // Calcular margem de lucro percentual
  const profitMarginPercent = sellingPrice > 0 ? (profitPerItem / sellingPrice) * 100 : 0

  // Determinar viabilidade com base em vários fatores
  const getViabilityStatus = () => {
    if (roi < 0) return "danger"
    if (roi < 15) return "warning"
    if (roi >= 30) return "excellent"
    return "good"
  }

  const viabilityStatus = getViabilityStatus()

  // Mensagens de viabilidade
  const viabilityMessages = {
    danger: {
      title: "Não Viável",
      message: "Este produto não é viável nas condições atuais. Você terá prejuízo.",
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      color: "text-red-500",
      recommendations: [
        "Aumente o preço de venda",
        "Reduza o custo do produto",
        "Aumente a quantidade para diluir custos fixos",
        "Reduza o orçamento de marketing",
      ],
    },
    warning: {
      title: "Viabilidade Limitada",
      message: "Este produto tem viabilidade limitada. O retorno sobre investimento é baixo.",
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      color: "text-amber-500",
      recommendations: [
        "Considere aumentar ligeiramente o preço",
        "Busque reduzir custos operacionais",
        "Aumente a quantidade para melhorar a margem",
      ],
    },
    good: {
      title: "Viável",
      message: "Este produto é viável e deve gerar lucro satisfatório.",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: "text-green-500",
      recommendations: [
        "Monitore a concorrência para manter competitividade",
        "Considere estratégias para aumentar o volume de vendas",
      ],
    },
    excellent: {
      title: "Altamente Viável",
      message: "Este produto é altamente viável com excelente retorno sobre investimento.",
      icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
      color: "text-emerald-500",
      recommendations: [
        "Considere aumentar o investimento em marketing",
        "Explore oportunidades de expansão para este produto",
        "Analise se o preço não está muito acima do mercado",
      ],
    },
  }

  // Calcular pontuação de viabilidade (0-100)
  const calculateViabilityScore = () => {
    // Fatores que contribuem para a pontuação
    const roiScore = Math.min(100, Math.max(0, roi * 2)) // ROI de 50% ou mais = 100 pontos
    const marginScore = Math.min(100, Math.max(0, profitMarginPercent * 2)) // Margem de 50% ou mais = 100 pontos
    const quantityScore = breakEvenQuantity > 0 ? Math.min(100, Math.max(0, (quantity / breakEvenQuantity) * 50)) : 0 // 2x o break-even = 100 pontos

    // Média ponderada
    return Math.round(roiScore * 0.5 + marginScore * 0.3 + quantityScore * 0.2)
  }

  const viabilityScore = calculateViabilityScore()

  // Garantir que o valor do Progress seja válido
  const safeProgressValue = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return 0
    if (value > 100) return 100
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Viabilidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            {viabilityMessages[viabilityStatus].icon}
            <div>
              <h3 className={`text-lg font-semibold ${viabilityMessages[viabilityStatus].color}`}>
                {viabilityMessages[viabilityStatus].title}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">{viabilityMessages[viabilityStatus].message}</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pontuação de Viabilidade</span>
              <span className="font-medium">{viabilityScore}/100</span>
            </div>
            <Progress
              value={safeProgressValue(viabilityScore)}
              className="h-2.5"
              indicatorClassName={
                viabilityStatus === "danger"
                  ? "bg-red-500"
                  : viabilityStatus === "warning"
                    ? "bg-amber-500"
                    : viabilityStatus === "good"
                      ? "bg-green-500"
                      : "bg-emerald-500"
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Indicadores Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Preço de Venda</dt>
                  <dd className="text-sm font-medium">{formatCurrency(sellingPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Custo do Produto</dt>
                  <dd className="text-sm font-medium">{formatCurrency(productCost)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Lucro por Unidade</dt>
                  <dd className="text-sm font-medium">{formatCurrency(profitPerItem)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Margem de Lucro</dt>
                  <dd className="text-sm font-medium">{profitMarginPercent.toFixed(1)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">ROI (Retorno sobre Investimento)</dt>
                  <dd className={`text-sm font-medium ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>{roi}%</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {viabilityMessages[viabilityStatus].recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Análise de Cenário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {quantity < breakEvenQuantity ? (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
                <p className="text-sm">
                  {quantity < breakEvenQuantity ? (
                    <>
                      Você precisa vender pelo menos <strong>{breakEvenQuantity - quantity} unidades a mais</strong>{" "}
                      para atingir o ponto de equilíbrio.
                    </>
                  ) : (
                    <>
                      Você está <strong>{quantity - breakEvenQuantity} unidades acima</strong> do ponto de equilíbrio.
                    </>
                  )}
                </p>
              </div>

              <p className="text-sm">
                Com a venda de <strong>{quantity} unidades</strong>, você terá um{" "}
                {totalProfit >= 0 ? "lucro" : "prejuízo"} de <strong>{formatCurrency(Math.abs(totalProfit))}</strong>.
              </p>

              <p className="text-sm">
                Para cada unidade adicional vendida acima do ponto de equilíbrio, você terá um lucro adicional de{" "}
                <strong>{formatCurrency(profitPerItem)}</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
