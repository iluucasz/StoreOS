"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BasicInfoStep } from "./simulator-steps/basic-info-step"
import { MarketDataStep } from "./simulator-steps/market-data-step"
import { AdvancedOptionsStep } from "./simulator-steps/advanced-options-step"
import { ResultsStep } from "./simulator-steps/results-step"
import { useSettings } from "@/contexts/settings-context"
import { ChevronLeft, ChevronRight, Save, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Tipos para os dados do simulador
export interface SimulatorData {
  // Informações Básicas
  scenarioName: string
  productQuantity: number
  averageUnitCost: number
  marketingBudget: number
  marketingPeriod: "weekly" | "monthly" | "quarterly"
  desiredProfitMargin: number
  sellingPrice: number | null // Novo campo para preço de venda direto
  useCustomSellingPrice: boolean // Flag para indicar se usa preço personalizado

  // Dados de Mercado
  targetAudience: "niche" | "mid" | "mass"
  seasonality: "low" | "normal" | "high"
  estimatedMonthlySales: number

  // Opções Avançadas
  estimationAccuracy: number
  projectionType: "pessimistic" | "realistic" | "optimistic"
}

// Valores padrão
const defaultSimulatorData: SimulatorData = {
  scenarioName: "Novo Cenário",
  productQuantity: 20,
  averageUnitCost: 40,
  marketingBudget: 300,
  marketingPeriod: "monthly",
  desiredProfitMargin: 20,
  sellingPrice: null,
  useCustomSellingPrice: false,

  targetAudience: "mass",
  seasonality: "normal",
  estimatedMonthlySales: 20,

  estimationAccuracy: 80,
  projectionType: "realistic",
}

export function AdvancedSimulator() {
  const { settings } = useSettings()
  const [currentStep, setCurrentStep] = useState(0)
  const [simulatorData, setSimulatorData] = useState<SimulatorData>(defaultSimulatorData)
  const [calculationComplete, setCalculationComplete] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Resultados calculados
  const [results, setResults] = useState<any>(null)

  const steps = [
    {
      title: "Informações Básicas",
      description: "Defina os parâmetros iniciais do seu cenário",
      icon: <BarChart3 className="h-5 w-5" />,
      component: BasicInfoStep,
    },
    {
      title: "Dados de Mercado",
      description: "Configure informações sobre seu mercado-alvo",
      icon: <BarChart3 className="h-5 w-5" />,
      component: MarketDataStep,
    },
    {
      title: "Opções Avançadas",
      description: "Ajuste configurações detalhadas para sua simulação",
      icon: <BarChart3 className="h-5 w-5" />,
      component: AdvancedOptionsStep,
    },
    {
      title: "Resultados",
      description: "Visualize as projeções e análises do seu cenário",
      icon: <BarChart3 className="h-5 w-5" />,
      component: ResultsStep,
    },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }

    // Se estamos indo para a etapa de resultados, calcular
    if (currentStep === steps.length - 2) {
      setIsCalculating(true)
      // Simular um pequeno atraso para mostrar o estado de carregamento
      setTimeout(() => {
        calculateResults()
        setIsCalculating(false)
      }, 800)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateSimulatorData = (newData: Partial<SimulatorData>) => {
    setSimulatorData((prev) => ({ ...prev, ...newData }))
  }

  const calculateResults = () => {
    // Garantir que as vendas estimadas não excedam a quantidade de produtos
    const limitedSales = Math.min(simulatorData.estimatedMonthlySales, simulatorData.productQuantity)

    // Cálculos básicos
    const totalProductCost = simulatorData.productQuantity * simulatorData.averageUnitCost

    // Ajustes baseados no público-alvo
    let audienceMultiplier = 1.0
    switch (simulatorData.targetAudience) {
      case "niche":
        audienceMultiplier = 1.3
        break
      case "mid":
        audienceMultiplier = 1.1
        break
      case "mass":
        audienceMultiplier = 1.0
        break
    }

    // Ajustes baseados na sazonalidade
    let seasonalityMultiplier = 1.0
    switch (simulatorData.seasonality) {
      case "low":
        seasonalityMultiplier = 0.8
        break
      case "normal":
        seasonalityMultiplier = 1.0
        break
      case "high":
        seasonalityMultiplier = 1.3
        break
    }

    // Ajustes baseados no tipo de projeção
    let projectionMultiplier = 1.0
    switch (simulatorData.projectionType) {
      case "pessimistic":
        projectionMultiplier = 0.7
        break
      case "realistic":
        projectionMultiplier = 1.0
        break
      case "optimistic":
        projectionMultiplier = 1.3
        break
    }

    // Cálculo do preço de venda
    let sellingPrice: number

    if (simulatorData.useCustomSellingPrice && simulatorData.sellingPrice !== null) {
      // Usar o preço de venda personalizado
      sellingPrice = simulatorData.sellingPrice
    } else {
      // Calcular o preço de venda com base na margem
      const costPerProduct = simulatorData.averageUnitCost
      const marketingCostPerProduct = simulatorData.marketingBudget / simulatorData.productQuantity
      const totalCostPerProduct = costPerProduct + marketingCostPerProduct

      // Preço de venda baseado na margem desejada
      sellingPrice =
        totalCostPerProduct / (1 - simulatorData.desiredProfitMargin / 100 - settings.paymentFeePercentage / 100)
    }

    // Ajuste do preço com base no público e sazonalidade
    const adjustedSellingPrice = sellingPrice * audienceMultiplier * seasonalityMultiplier

    const paymentFee = adjustedSellingPrice * (settings.paymentFeePercentage / 100)

    // Cálculo do custo total por produto
    const costPerProduct = simulatorData.averageUnitCost
    const marketingCostPerProduct = simulatorData.marketingBudget / simulatorData.productQuantity
    const totalCostPerProduct = costPerProduct + marketingCostPerProduct

    const profitPerUnit = adjustedSellingPrice - totalCostPerProduct - paymentFee

    // Projeções de vendas (limitadas à quantidade de produtos)
    const baseEstimatedSales = limitedSales
    const estimatedSales = Math.min(
      Math.round(baseEstimatedSales * seasonalityMultiplier * projectionMultiplier),
      simulatorData.productQuantity,
    )

    // Projeções financeiras
    const monthlyRevenue = estimatedSales * adjustedSellingPrice
    const monthlyCosts = totalProductCost + simulatorData.marketingBudget
    const monthlyProfit = monthlyRevenue - monthlyCosts - estimatedSales * paymentFee

    // Cálculo do ROI
    const roi = (monthlyProfit / monthlyCosts) * 100

    // Cálculo do ponto de equilíbrio
    const breakEvenUnits = Math.ceil(
      (totalProductCost + simulatorData.marketingBudget) / (adjustedSellingPrice - costPerProduct - paymentFee),
    )

    // Variação baseada na precisão da estimativa
    const accuracyFactor = (100 - simulatorData.estimationAccuracy) / 100
    const variationRange = monthlyProfit * accuracyFactor

    // Resultados para diferentes cenários
    const pessimisticProfit = monthlyProfit - variationRange
    const realisticProfit = monthlyProfit
    const optimisticProfit = monthlyProfit + variationRange

    // Gerar dados para o gráfico
    const chartData = []
    const maxSales = Math.min(Math.max(estimatedSales * 2, breakEvenUnits * 1.5), simulatorData.productQuantity)

    for (let i = 0; i <= maxSales; i += Math.max(1, Math.floor(maxSales / 10))) {
      const sales = i
      const revenue = sales * adjustedSellingPrice
      const costs = totalProductCost + simulatorData.marketingBudget
      const profit = revenue - costs - sales * paymentFee

      chartData.push({
        sales,
        revenue,
        costs,
        profit,
      })
    }

    setResults({
      sellingPrice: adjustedSellingPrice,
      baseSellingPrice: sellingPrice,
      profitPerUnit,
      estimatedSales,
      monthlyRevenue,
      monthlyCosts,
      monthlyProfit,
      roi,
      breakEvenUnits,
      pessimisticProfit,
      realisticProfit,
      optimisticProfit,
      chartData,
      paymentFee,
      totalCostPerProduct,
      audienceMultiplier,
      seasonalityMultiplier,
      projectionMultiplier,
      limitedSales,
    })

    setCalculationComplete(true)
  }

  const saveScenario = () => {
    // Aqui implementaríamos a lógica para salvar o cenário
    const scenarioData = {
      ...simulatorData,
      results,
      createdAt: new Date().toISOString(),
    }

    // Salvar no localStorage
    const savedScenarios = JSON.parse(localStorage.getItem("savedScenarios") || "[]")
    savedScenarios.push(scenarioData)
    localStorage.setItem("savedScenarios", JSON.stringify(savedScenarios))

    alert("Cenário salvo com sucesso!")
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-8">
      {/* Cabeçalho e progresso */}
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            <span className="font-medium">Etapa {currentStep + 1}</span>
            <span>de</span>
            <span className="font-medium">{steps.length}</span>
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {steps.map((step, index) => (
              <div key={index} className={`${index === currentStep ? "text-primary font-medium" : ""}`}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card className="border shadow-lg">
        <CardContent className="p-6 md:p-8">
          <CurrentStepComponent
            data={simulatorData}
            updateData={updateSimulatorData}
            results={results}
            isCalculating={isCalculating}
          />
        </CardContent>
      </Card>

      {/* Botões de navegação */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="shadow-sm">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-3">
          {currentStep === steps.length - 1 && calculationComplete && (
            <Button onClick={saveScenario} className="shadow-sm bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              Salvar Cenário
            </Button>
          )}

          {currentStep < steps.length - 1 && (
            <Button onClick={handleNext} className="shadow-sm" disabled={isCalculating}>
              {currentStep === steps.length - 2 ? (isCalculating ? "Calculando..." : "Calcular") : "Próximo"}
              {!isCalculating && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
