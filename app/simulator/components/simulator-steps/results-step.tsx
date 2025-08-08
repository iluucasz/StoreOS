"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SimulatorData } from "../advanced-simulator"
import { ScenarioChart } from "../scenario-chart"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDown,
  ArrowUp,
  Minus,
  DollarSign,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Loader2,
  Calculator,
  Percent,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ResultsStepProps {
  data: SimulatorData
  updateData: (data: Partial<SimulatorData>) => void
  results: any
  isCalculating?: boolean
}

export function ResultsStep({ data, results, isCalculating = false }: ResultsStepProps) {
  if (isCalculating) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium mb-2">Calculando resultados...</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Estamos processando todos os dados do seu cenário para gerar projeções precisas.
          </p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const getROIStatus = (roi: number) => {
    if (roi < 0)
      return {
        icon: <ArrowDown className="h-4 w-4 text-red-500" />,
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
      }
    if (roi < 20)
      return {
        icon: <Minus className="h-4 w-4 text-yellow-500" />,
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      }
    return {
      icon: <ArrowUp className="h-4 w-4 text-green-500" />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    }
  }

  const roiStatus = getROIStatus(results.roi)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-md">
          <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Resumo do Cenário
            </CardTitle>
            <CardDescription>{data.scenarioName}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Preço de venda</span>
                </div>
                <span className="font-medium">{formatCurrency(results.sellingPrice)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Lucro por unidade</span>
                </div>
                <span className="font-medium">{formatCurrency(results.profitPerUnit)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ponto de equilíbrio</span>
                </div>
                <span className="font-medium">{results.breakEvenUnits} unidades</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vendas estimadas (mensal)</span>
                </div>
                <span className="font-medium">{results.estimatedSales} unidades</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ROI projetado</span>
                </div>
                <span className={`font-medium flex items-center gap-1 ${roiStatus.color}`}>
                  {roiStatus.icon}
                  {results.roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-md">
          <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Projeção Financeira Mensal
            </CardTitle>
            <CardDescription>Baseada em {results.estimatedSales} vendas/mês</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Receita bruta</span>
                </div>
                <span className="font-medium">{formatCurrency(results.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Custos totais</span>
                </div>
                <span className="font-medium">{formatCurrency(results.monthlyCosts)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Taxas de pagamento</span>
                </div>
                <span className="font-medium">{formatCurrency(results.paymentFee * results.estimatedSales)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 border-t pt-3 mt-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Lucro líquido</span>
                </div>
                <span className="font-medium text-lg">{formatCurrency(results.monthlyProfit)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                <span className="font-medium">Margem de lucro final</span>
                <Badge variant={results.monthlyProfit > 0 ? "success" : "destructive"} className="text-xs">
                  {((results.monthlyProfit / results.monthlyRevenue) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="chart" className="text-sm">
            Gráfico de Projeção
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="text-sm">
            Cenários
          </TabsTrigger>
          <TabsTrigger value="details" className="text-sm">
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="calculations" className="text-sm">
            Cálculos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="border shadow-md">
            <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Projeção de Vendas e Lucro
              </CardTitle>
              <CardDescription>Ponto de equilíbrio: {results.breakEvenUnits} unidades</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-80">
                <ScenarioChart
                  data={results.chartData}
                  breakEven={results.breakEvenUnits}
                  requiredSales={results.estimatedSales}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card className="border shadow-md">
            <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Cenários de Projeção
              </CardTitle>
              <CardDescription>Baseados em {data.estimationAccuracy}% de precisão</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-red-800 dark:text-red-300">
                    <ArrowDown className="h-4 w-4 mr-2 text-red-500" />
                    Cenário Pessimista
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Lucro mensal:</div>
                      <div className="font-medium">{formatCurrency(results.pessimisticProfit)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Vendas estimadas:</div>
                      <div className="font-medium">
                        {Math.min(Math.round(results.estimatedSales * 0.7), data.productQuantity)} unidades
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-blue-800 dark:text-blue-300">
                    <Minus className="h-4 w-4 mr-2 text-blue-500" />
                    Cenário Realista
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Lucro mensal:</div>
                      <div className="font-medium">{formatCurrency(results.realisticProfit)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Vendas estimadas:</div>
                      <div className="font-medium">{results.estimatedSales} unidades</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 shadow-sm">
                  <h3 className="font-medium mb-2 flex items-center text-green-800 dark:text-green-300">
                    <ArrowUp className="h-4 w-4 mr-2 text-green-500" />
                    Cenário Otimista
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Lucro mensal:</div>
                      <div className="font-medium">{formatCurrency(results.optimisticProfit)}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Vendas estimadas:</div>
                      <div className="font-medium">
                        {Math.min(Math.round(results.estimatedSales * 1.3), data.productQuantity)} unidades
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card className="border shadow-md">
            <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Detalhes do Cálculo
              </CardTitle>
              <CardDescription>Parâmetros utilizados na simulação</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm border-b pb-1">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Quantidade de produtos:</span>
                    <span className="font-medium">{data.productQuantity} unidades</span>

                    <span className="text-muted-foreground">Custo unitário médio:</span>
                    <span className="font-medium">{formatCurrency(data.averageUnitCost)}</span>

                    <span className="text-muted-foreground">Investimento em marketing:</span>
                    <span className="font-medium">{formatCurrency(data.marketingBudget)}</span>

                    <span className="text-muted-foreground">Período de marketing:</span>
                    <span className="font-medium">
                      {data.marketingPeriod === "weekly"
                        ? "Semanal"
                        : data.marketingPeriod === "monthly"
                          ? "Mensal"
                          : "Trimestral"}
                    </span>

                    <span className="text-muted-foreground">Preço de venda:</span>
                    <span className="font-medium">{formatCurrency(results.sellingPrice)}</span>

                    {!data.useCustomSellingPrice && (
                      <>
                        <span className="text-muted-foreground">Margem de lucro desejada:</span>
                        <span className="font-medium">{data.desiredProfitMargin}%</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm border-b pb-1">Dados de Mercado e Projeção</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Público-alvo:</span>
                    <span className="font-medium">
                      {data.targetAudience === "niche"
                        ? "Nicho (específico)"
                        : data.targetAudience === "mid"
                          ? "Intermediário"
                          : "Massa (amplo)"}
                    </span>

                    <span className="text-muted-foreground">Sazonalidade:</span>
                    <span className="font-medium">
                      {data.seasonality === "low"
                        ? "Baixa temporada"
                        : data.seasonality === "normal"
                          ? "Temporada normal"
                          : "Alta temporada"}
                    </span>

                    <span className="text-muted-foreground">Vendas estimadas:</span>
                    <span className="font-medium">{results.estimatedSales} unidades</span>

                    <span className="text-muted-foreground">Tipo de projeção:</span>
                    <span className="font-medium">
                      {data.projectionType === "pessimistic"
                        ? "Pessimista"
                        : data.projectionType === "realistic"
                          ? "Realista"
                          : "Otimista"}
                    </span>

                    <span className="text-muted-foreground">Precisão da estimativa:</span>
                    <span className="font-medium">{data.estimationAccuracy}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations">
          <div className="space-y-6">
            {/* Seção de Multiplicadores */}
            <Card className="border shadow-md">
              <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  Multiplicadores Aplicados
                </CardTitle>
                <CardDescription>Fatores que influenciam os cálculos</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-sm">
                    <div className="text-sm font-medium mb-2">Multiplicador de Público:</div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-lg font-bold">
                        {data.targetAudience === "niche" ? "1.3" : data.targetAudience === "mid" ? "1.1" : "1.0"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        (
                        {data.targetAudience === "niche"
                          ? "Nicho"
                          : data.targetAudience === "mid"
                            ? "Intermediário"
                            : "Massa"}
                        )
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-sm">
                    <div className="text-sm font-medium mb-2">Multiplicador de Sazonalidade:</div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-lg font-bold">
                        {data.seasonality === "low" ? "0.8" : data.seasonality === "normal" ? "1.0" : "1.3"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({data.seasonality === "low" ? "Baixa" : data.seasonality === "normal" ? "Normal" : "Alta"})
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-sm">
                    <div className="text-sm font-medium mb-2">Multiplicador de Projeção:</div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-lg font-bold">
                        {data.projectionType === "pessimistic"
                          ? "0.7"
                          : data.projectionType === "realistic"
                            ? "1.0"
                            : "1.3"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        (
                        {data.projectionType === "pessimistic"
                          ? "Pessimista"
                          : data.projectionType === "realistic"
                            ? "Realista"
                            : "Otimista"}
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção de Cálculos de Custo e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cálculos de Custo */}
              <Card className="border shadow-md">
                <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Cálculos de Custo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Custo total dos produtos:</span>
                      <div className="font-mono text-sm">
                        {data.productQuantity} × {formatCurrency(data.averageUnitCost)} ={" "}
                        <span className="font-bold">{formatCurrency(data.productQuantity * data.averageUnitCost)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Custo de marketing por produto:</span>
                      <div className="font-mono text-sm">
                        {formatCurrency(data.marketingBudget)} ÷ {data.productQuantity} ={" "}
                        <span className="font-bold">{formatCurrency(data.marketingBudget / data.productQuantity)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Custo total por produto:</span>
                      <div className="font-mono text-sm">
                        {formatCurrency(data.averageUnitCost)} +{" "}
                        {formatCurrency(data.marketingBudget / data.productQuantity)} ={" "}
                        <span className="font-bold">{formatCurrency(results.totalCostPerProduct)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cálculos de Preço */}
              <Card className="border shadow-md">
                <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Cálculos de Preço de Venda
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {data.useCustomSellingPrice ? (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-sm mb-1">Preço de venda definido manualmente:</p>
                        <div className="font-mono text-sm font-bold">
                          Preço base = {formatCurrency(results.baseSellingPrice)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-sm mb-1">Fórmula do preço de venda base:</p>
                        <div className="font-mono text-sm">
                          Preço = Custo Total / (1 - Margem Desejada - Taxa de Pagamento)
                        </div>
                        <div className="font-mono text-sm mt-2">
                          {formatCurrency(results.totalCostPerProduct)} / (1 - {data.desiredProfitMargin / 100} -{" "}
                          {(results.paymentFee / results.sellingPrice).toFixed(4)}) ={" "}
                          <span className="font-bold">{formatCurrency(results.baseSellingPrice)}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Ajuste por público-alvo:</span>
                      <div className="font-mono text-sm">
                        {formatCurrency(results.baseSellingPrice)} × {results.audienceMultiplier} ={" "}
                        <span className="font-bold">
                          {formatCurrency(results.baseSellingPrice * results.audienceMultiplier)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Ajuste por sazonalidade:</span>
                      <div className="font-mono text-sm">
                        {formatCurrency(results.baseSellingPrice * results.audienceMultiplier)} ×{" "}
                        {results.seasonalityMultiplier} ={" "}
                        <span className="font-bold">{formatCurrency(results.sellingPrice)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seção de Lucro e Projeção */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cálculos de Lucro */}
              <Card className="border shadow-md">
                <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowUp className="h-5 w-5 text-primary" />
                    Cálculos de Lucro
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Receita por unidade:</span>
                      <div className="font-mono text-sm">
                        <span className="font-bold">{formatCurrency(results.sellingPrice)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Custo por unidade:</span>
                      <div className="font-mono text-sm">
                        - <span className="font-bold">{formatCurrency(results.totalCostPerProduct)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Taxa de pagamento:</span>
                      <div className="font-mono text-sm">
                        - <span className="font-bold">{formatCurrency(results.paymentFee)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded-md border-t border-primary/20">
                      <span className="font-medium">Lucro por unidade:</span>
                      <div className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
                        = {formatCurrency(results.profitPerUnit)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cálculos de Projeção */}
              <Card className="border shadow-md">
                <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Cálculos de Projeção Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Vendas estimadas (limitadas):</span>
                      <div className="font-mono text-sm">
                        Min({results.limitedSales} × {results.seasonalityMultiplier} × {results.projectionMultiplier},{" "}
                        {data.productQuantity}) = <span className="font-bold">{results.estimatedSales}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Receita mensal:</span>
                      <div className="font-mono text-sm">
                        {results.estimatedSales} × {formatCurrency(results.sellingPrice)} ={" "}
                        <span className="font-bold">{formatCurrency(results.monthlyRevenue)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <span className="text-sm">Custos mensais:</span>
                      <div className="font-mono text-sm">
                        {formatCurrency(data.productQuantity * data.averageUnitCost)} +{" "}
                        {formatCurrency(data.marketingBudget)} ={" "}
                        <span className="font-bold">{formatCurrency(results.monthlyCosts)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-primary/10 rounded-md border-t border-primary/20">
                      <span className="font-medium">Lucro mensal:</span>
                      <div className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
                        = {formatCurrency(results.monthlyProfit)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI e Ponto de Equilíbrio */}
            <Card className="border shadow-md">
              <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  ROI e Ponto de Equilíbrio
                </CardTitle>
                <CardDescription>Métricas importantes para análise de viabilidade</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Cálculo do ROI:</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-mono text-sm mb-2">ROI = (Lucro Mensal / Custos Mensais) × 100</div>
                      <div className="font-mono text-sm">
                        ({formatCurrency(results.monthlyProfit)} / {formatCurrency(results.monthlyCosts)}) × 100 ={" "}
                        <span className="font-bold">{results.roi.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Cálculo do Ponto de Equilíbrio:</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-mono text-sm mb-2">
                        Ponto de Equilíbrio = Custos Totais / (Preço de Venda - Custo por Unidade - Taxa de Pagamento)
                      </div>
                      <div className="font-mono text-sm">
                        {formatCurrency(data.productQuantity * data.averageUnitCost + data.marketingBudget)} / (
                        {formatCurrency(results.sellingPrice)} - {formatCurrency(data.averageUnitCost)} -{" "}
                        {formatCurrency(results.paymentFee)}) ={" "}
                        <span className="font-bold">{results.breakEvenUnits} unidades</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
