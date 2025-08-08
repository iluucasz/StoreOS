"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/settings-context"
import { PriceBreakdown } from "@/app/calculator/components/price-breakdown"
import { Button } from "@/components/ui/button"
import { Save, Share2, Lightbulb, Info, Calculator } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViabilityAnalysis } from "@/app/calculator/components/viability-analysis"
import { ProfitProjection } from "@/app/calculator/components/profit-projection"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function PriceCalculator() {
  const { settings } = useSettings()

  // Estados para valores da calculadora
  const [productCost, setProductCost] = useState(40)
  const [quantity, setQuantity] = useState(5)
  const [profitMargin, setProfitMargin] = useState(30)
  const [sellingPrice, setSellingPrice] = useState(0)
  const [profitPerItem, setProfitPerItem] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [roi, setRoi] = useState(0)

  // Estados para custos personalizáveis
  const [useGlobalSettings, setUseGlobalSettings] = useState(true)
  const [shippingCost, setShippingCost] = useState(settings.shippingCost)
  const [packagingCost, setPackagingCost] = useState(settings.packagingCost)
  const [paymentFeePercentage, setPaymentFeePercentage] = useState(settings.paymentFeePercentage)

  // Estados para marketing
  const [useMarketing, setUseMarketing] = useState(false)
  const [marketingBudget, setMarketingBudget] = useState(settings.marketingBudget)
  const [marketingPeriod, setMarketingPeriod] = useState("monthly")

  // Calculated costs
  const [shippingCostPerItem, setShippingCostPerItem] = useState(0)
  const [packagingCostPerItem, setPackagingCostPerItem] = useState(0)
  const [marketingCostPerItem, setMarketingCostPerItem] = useState(0)
  const [paymentFeesPerItem, setPaymentFeesPerItem] = useState(0)
  const [totalCostPerItem, setTotalCostPerItem] = useState(0)
  const [breakEvenQuantity, setBreakEvenQuantity] = useState(0)
  const [profitableQuantity, setProfitableQuantity] = useState(0)

  // Estado para armazenar os cálculos detalhados
  const [detailedCalculations, setDetailedCalculations] = useState<string[]>([])

  // Atualizar valores quando as configurações globais mudarem
  useEffect(() => {
    if (useGlobalSettings) {
      setShippingCost(settings.shippingCost)
      setPackagingCost(settings.packagingCost)
      setPaymentFeePercentage(settings.paymentFeePercentage)
      if (useMarketing) {
        setMarketingBudget(settings.marketingBudget)
      }
    }
  }, [settings, useGlobalSettings, useMarketing])

  // Calcular custos e preços
  useEffect(() => {
    try {
      // Validar entradas para evitar cálculos com valores inválidos
      if (
        isNaN(productCost) ||
        isNaN(quantity) ||
        isNaN(profitMargin) ||
        isNaN(shippingCost) ||
        isNaN(packagingCost) ||
        isNaN(paymentFeePercentage) ||
        quantity <= 0
      ) {
        return
      }

      // Array para armazenar os passos do cálculo
      const calculationSteps: string[] = []
      calculationSteps.push(`1. Dados iniciais:`)
      calculationSteps.push(`   - Custo do produto: ${formatCurrency(productCost)}`)
      calculationSteps.push(`   - Quantidade: ${quantity} unidades`)
      calculationSteps.push(`   - Margem de lucro desejada: ${profitMargin}%`)
      calculationSteps.push(`   - Frete do lote: ${formatCurrency(shippingCost)}`)
      calculationSteps.push(`   - Custo de embalagem por unidade: ${formatCurrency(packagingCost)}`)
      calculationSteps.push(`   - Taxa de pagamento: ${paymentFeePercentage}%`)

      // Ajustar orçamento de marketing com base no período
      let adjustedMarketingBudget = 0
      if (useMarketing) {
        adjustedMarketingBudget = marketingBudget
        if (marketingPeriod === "daily") {
          adjustedMarketingBudget = marketingBudget * 30 // Aproximadamente um mês
          calculationSteps.push(
            `   - Marketing diário: ${formatCurrency(marketingBudget)} × 30 dias = ${formatCurrency(adjustedMarketingBudget)}`,
          )
        } else if (marketingPeriod === "weekly") {
          adjustedMarketingBudget = marketingBudget * 4 // Aproximadamente um mês
          calculationSteps.push(
            `   - Marketing semanal: ${formatCurrency(marketingBudget)} × 4 semanas = ${formatCurrency(adjustedMarketingBudget)}`,
          )
        } else {
          calculationSteps.push(`   - Marketing mensal: ${formatCurrency(marketingBudget)}`)
        }
      } else {
        calculationSteps.push(`   - Marketing: Desativado`)
      }

      // Calcular custos por item
      calculationSteps.push(`\n2. Cálculo de custos por item:`)

      const shippingPerItem = shippingCost / quantity
      calculationSteps.push(
        `   - Frete por item: ${formatCurrency(shippingCost)} ÷ ${quantity} = ${formatCurrency(shippingPerItem)}`,
      )

      const packagingPerItem = packagingCost
      calculationSteps.push(`   - Embalagem por item: ${formatCurrency(packagingPerItem)}`)

      let marketingPerItem = 0
      if (useMarketing) {
        const expectedSales = Math.max(1, settings.expectedMonthlySales)
        marketingPerItem = adjustedMarketingBudget / expectedSales
        calculationSteps.push(
          `   - Marketing por item: ${formatCurrency(adjustedMarketingBudget)} ÷ ${expectedSales} vendas esperadas = ${formatCurrency(marketingPerItem)}`,
        )
      } else {
        calculationSteps.push(`   - Marketing por item: ${formatCurrency(0)} (desativado)`)
      }

      setShippingCostPerItem(shippingPerItem)
      setPackagingCostPerItem(packagingPerItem)
      setMarketingCostPerItem(marketingPerItem)

      // Calcular custo total por item
      const totalCost = productCost + shippingPerItem + packagingPerItem + marketingPerItem
      setTotalCostPerItem(totalCost)
      calculationSteps.push(
        `   - Custo total por item: ${formatCurrency(productCost)} + ${formatCurrency(shippingPerItem)} + ${formatCurrency(packagingPerItem)} + ${formatCurrency(marketingPerItem)} = ${formatCurrency(totalCost)}`,
      )

      // Calcular preço de venda com base na margem de lucro
      calculationSteps.push(`\n3. Cálculo do preço de venda:`)

      // Evitar divisão por zero ou valores negativos
      const denominator = 1 - profitMargin / 100 - paymentFeePercentage / 100
      calculationSteps.push(
        `   - Denominador para cálculo do preço: 1 - (${profitMargin}% ÷ 100) - (${paymentFeePercentage}% ÷ 100) = ${denominator.toFixed(4)}`,
      )

      const calculatedPrice = denominator > 0 ? totalCost / denominator : totalCost * 2
      setSellingPrice(Number.parseFloat(calculatedPrice.toFixed(2)))
      calculationSteps.push(
        `   - Preço de venda: ${formatCurrency(totalCost)} ÷ ${denominator.toFixed(4)} = ${formatCurrency(calculatedPrice)}`,
      )

      // Calcular taxas de pagamento
      const fees = calculatedPrice * (paymentFeePercentage / 100)
      setPaymentFeesPerItem(fees)
      calculationSteps.push(
        `   - Taxa de pagamento por item: ${formatCurrency(calculatedPrice)} × (${paymentFeePercentage}% ÷ 100) = ${formatCurrency(fees)}`,
      )

      // Calcular lucro por item
      const profit = calculatedPrice - totalCost - fees
      setProfitPerItem(Number.parseFloat(profit.toFixed(2)))
      calculationSteps.push(
        `   - Lucro por item: ${formatCurrency(calculatedPrice)} - ${formatCurrency(totalCost)} - ${formatCurrency(fees)} = ${formatCurrency(profit)}`,
      )

      // Calcular lucro total
      const totalProfitValue = profit * quantity
      setTotalProfit(Number.parseFloat(totalProfitValue.toFixed(2)))
      calculationSteps.push(
        `   - Lucro total: ${formatCurrency(profit)} × ${quantity} = ${formatCurrency(totalProfitValue)}`,
      )

      // Calcular ROI (Return on Investment)
      calculationSteps.push(`\n4. Cálculo do ROI (Retorno sobre Investimento):`)

      const totalProductCost = productCost * quantity
      const totalPackagingCost = packagingCost * quantity
      const totalInvestment =
        totalProductCost + shippingCost + totalPackagingCost + (useMarketing ? adjustedMarketingBudget : 0)
      calculationSteps.push(
        `   - Investimento total: (${formatCurrency(productCost)} × ${quantity}) + ${formatCurrency(shippingCost)} + (${formatCurrency(packagingCost)} × ${quantity}) + ${formatCurrency(useMarketing ? adjustedMarketingBudget : 0)} = ${formatCurrency(totalInvestment)}`,
      )

      const totalRevenue = calculatedPrice * quantity
      calculationSteps.push(
        `   - Receita total: ${formatCurrency(calculatedPrice)} × ${quantity} = ${formatCurrency(totalRevenue)}`,
      )

      const roiValue = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0
      setRoi(Number.parseFloat(roiValue.toFixed(2)))
      calculationSteps.push(
        `   - ROI: ((${formatCurrency(totalRevenue)} - ${formatCurrency(totalInvestment)}) ÷ ${formatCurrency(totalInvestment)}) × 100 = ${roiValue.toFixed(2)}%`,
      )

      // Calcular quantidade de equilíbrio (break-even)
      calculationSteps.push(`\n5. Cálculo do ponto de equilíbrio:`)

      // Ponto onde a receita total = custo total
      const fixedCosts = shippingCost + (useMarketing ? adjustedMarketingBudget : 0)
      calculationSteps.push(
        `   - Custos fixos: ${formatCurrency(shippingCost)} + ${formatCurrency(useMarketing ? adjustedMarketingBudget : 0)} = ${formatCurrency(fixedCosts)}`,
      )

      const contributionMargin = calculatedPrice - productCost - packagingCost - fees
      calculationSteps.push(
        `   - Margem de contribuição por item: ${formatCurrency(calculatedPrice)} - ${formatCurrency(productCost)} - ${formatCurrency(packagingCost)} - ${formatCurrency(fees)} = ${formatCurrency(contributionMargin)}`,
      )

      // Evitar divisão por zero
      let breakEven = 0
      if (contributionMargin > 0) {
        breakEven = Math.ceil(fixedCosts / contributionMargin)
        calculationSteps.push(
          `   - Ponto de equilíbrio: ${formatCurrency(fixedCosts)} ÷ ${formatCurrency(contributionMargin)} = ${breakEven} unidades`,
        )
      } else {
        breakEven = quantity * 2 // Valor arbitrário se a margem de contribuição for negativa
        calculationSteps.push(`   - Ponto de equilíbrio: Não calculável (margem de contribuição negativa)`)
      }
      setBreakEvenQuantity(breakEven)

      // Calcular quantidade lucrativa (20% acima do break-even)
      const profitable = Math.ceil(breakEven * 1.2)
      setProfitableQuantity(profitable)
      calculationSteps.push(
        `   - Quantidade lucrativa (20% acima do ponto de equilíbrio): ${breakEven} × 1.2 = ${profitable} unidades`,
      )

      // Atualizar os passos de cálculo
      setDetailedCalculations(calculationSteps)
    } catch (error) {
      console.error("Erro nos cálculos:", error)
    }
  }, [
    productCost,
    quantity,
    profitMargin,
    shippingCost,
    packagingCost,
    paymentFeePercentage,
    useMarketing,
    marketingBudget,
    marketingPeriod,
    settings.expectedMonthlySales,
  ])

  // Função para sugerir quantidade ideal
  const suggestQuantity = () => {
    try {
      // Calcular o custo fixo total
      let adjustedMarketingBudget = 0
      if (useMarketing) {
        adjustedMarketingBudget = marketingBudget
        if (marketingPeriod === "daily") {
          adjustedMarketingBudget = marketingBudget * 30
        } else if (marketingPeriod === "weekly") {
          adjustedMarketingBudget = marketingBudget * 4
        }
      }

      // Custo fixo total (frete + marketing)
      const fixedCosts = shippingCost + (useMarketing ? adjustedMarketingBudget : 0)

      // Custo variável por unidade (produto + embalagem)
      const variableCostPerUnit = productCost + packagingCost

      // Calcular o preço de venda estimado para uma unidade
      const estimatedSellingPrice = variableCostPerUnit / (1 - profitMargin / 100 - paymentFeePercentage / 100)

      // Taxa de pagamento por unidade
      const paymentFeePerUnit = estimatedSellingPrice * (paymentFeePercentage / 100)

      // Margem de contribuição por unidade (quanto cada unidade contribui para cobrir custos fixos)
      const contributionMargin = estimatedSellingPrice - variableCostPerUnit - paymentFeePerUnit

      // Evitar divisão por zero
      if (contributionMargin <= 0) {
        // Se a margem de contribuição for negativa ou zero, sugerir uma quantidade mínima razoável
        setQuantity(10)
        return
      }

      // Calcular o ponto de equilíbrio (break-even point)
      // Esta é a quantidade mínima necessária para cobrir todos os custos fixos
      const breakEvenPoint = Math.ceil(fixedCosts / contributionMargin)

      // Calcular a quantidade ideal para otimizar o frete
      // Quanto maior a quantidade, menor o custo de frete por unidade
      const freightOptimizationFactor = Math.sqrt(shippingCost / 20)
      const freightOptimalQuantity = Math.max(5, Math.ceil(freightOptimizationFactor * 5))

      // Calcular a quantidade ideal para marketing
      // Quanto maior o orçamento de marketing, mais unidades precisamos vender para diluir esse custo
      let marketingOptimalQuantity = 0
      if (useMarketing && adjustedMarketingBudget > 0) {
        // Calculamos quantas unidades são necessárias para cobrir o orçamento de marketing
        // com uma margem de lucro razoável
        const marketingCostPerUnit = adjustedMarketingBudget / Math.max(10, settings.expectedMonthlySales)
        const targetMarketingROI = 3 // Queremos um ROI de 3x para o marketing
        marketingOptimalQuantity = Math.ceil(
          (adjustedMarketingBudget * targetMarketingROI) / (contributionMargin - marketingCostPerUnit),
        )

        // Garantir que seja pelo menos 20% maior que o ponto de equilíbrio
        marketingOptimalQuantity = Math.max(marketingOptimalQuantity, Math.ceil(breakEvenPoint * 1.2))
      }

      // Calcular a quantidade ideal para ROI geral
      // Queremos um ROI de pelo menos 30%
      const targetROI = 0.3 // 30%
      const roiOptimalQuantity = Math.ceil(
        (fixedCosts + targetROI * fixedCosts) / (contributionMargin - targetROI * variableCostPerUnit),
      )

      // Combinar os fatores para determinar a quantidade sugerida
      // Usamos o máximo entre o ponto de equilíbrio, a quantidade ótima para frete,
      // a quantidade ótima para marketing e a quantidade ótima para ROI
      const suggestedQuantity = Math.max(
        Math.ceil(breakEvenPoint * 1.2), // 20% acima do ponto de equilíbrio
        freightOptimalQuantity,
        marketingOptimalQuantity,
        roiOptimalQuantity > 0 ? roiOptimalQuantity : 0,
      )

      // Limitar a quantidade máxima para evitar sugestões irrealistas
      // Se o custo do produto for alto, limitamos a quantidade para evitar um investimento inicial muito alto
      const maxSuggestedBasedOnCost = Math.max(10, Math.floor(2000 / productCost))

      // Quantidade final sugerida (limitada a um valor máximo razoável)
      const finalSuggestedQuantity = Math.min(suggestedQuantity, maxSuggestedBasedOnCost, 200)

      // Atualizar a quantidade
      setQuantity(finalSuggestedQuantity)
    } catch (error) {
      console.error("Erro ao sugerir quantidade:", error)
      // Em caso de erro, sugerir uma quantidade padrão razoável
      setQuantity(10)
    }
  }

  // Função para sugerir orçamento de marketing ideal
  const suggestMarketingBudget = () => {
    try {
      // Ativar marketing se estiver desativado
      if (!useMarketing) {
        setUseMarketing(true)
      }

      // Valores fixos para cálculo (não dependem de valores que flutuam)
      const baseProductCost = productCost // Custo base do produto
      const baseQuantity = quantity // Quantidade no lote

      // Calcular o preço de venda por unidade de forma determinística
      const baseSellingPrice = baseProductCost / (1 - profitMargin / 100 - paymentFeePercentage / 100)

      // Calcular o lucro por unidade de forma determinística
      const baseProfit = baseSellingPrice * (profitMargin / 100)

      // Calcular o valor total do pedido
      const orderValue = baseSellingPrice * baseQuantity

      // Definir uma porcentagem fixa do valor do pedido para marketing
      // Usamos uma escala decrescente: quanto maior o valor do pedido, menor a porcentagem
      let marketingPercentage

      if (orderValue < 100) {
        marketingPercentage = 0.25 // 25% para pedidos pequenos
      } else if (orderValue < 500) {
        marketingPercentage = 0.2 // 20% para pedidos médios
      } else if (orderValue < 1000) {
        marketingPercentage = 0.15 // 15% para pedidos grandes
      } else {
        marketingPercentage = 0.1 // 10% para pedidos muito grandes
      }

      // Calcular o orçamento de marketing com base no valor do pedido
      let suggestedBudget = orderValue * marketingPercentage

      // Ajustar com base no período selecionado
      if (marketingPeriod === "daily") {
        // Para orçamento diário, dividimos o valor mensal por 30
        suggestedBudget = suggestedBudget / 30
      } else if (marketingPeriod === "weekly") {
        // Para orçamento semanal, dividimos o valor mensal por 4
        suggestedBudget = suggestedBudget / 4
      }

      // Garantir valores mínimos razoáveis com base no período
      const minBudget = marketingPeriod === "daily" ? 5 : marketingPeriod === "weekly" ? 35 : 150

      suggestedBudget = Math.max(suggestedBudget, minBudget)

      // Arredondar para um número inteiro para evitar flutuações por arredondamento
      suggestedBudget = Math.round(suggestedBudget)

      // Limitar a um valor máximo razoável com base no período
      const maxBudget = marketingPeriod === "daily" ? 1000 : marketingPeriod === "weekly" ? 5000 : 20000

      suggestedBudget = Math.min(suggestedBudget, maxBudget)

      // Definir o orçamento de marketing
      setMarketingBudget(suggestedBudget)
    } catch (error) {
      console.error("Erro ao sugerir orçamento de marketing:", error)
      // Em caso de erro, definir um valor padrão razoável com base no período
      const defaultBudget = marketingPeriod === "daily" ? 10 : marketingPeriod === "weekly" ? 70 : 300
      setMarketingBudget(defaultBudget)
    }
  }

  const handleSavePrice = () => {
    // Implementar save functionality
    alert("Preço salvo com sucesso!")
  }

  const handleSharePrice = () => {
    // Implementar share functionality
    const shareText = `
Análise de Precificação:
Produto: R$${productCost}
Quantidade: ${quantity} unidades
Preço de venda: R$${sellingPrice}
Lucro por item: R$${profitPerItem}
Lucro total: R$${totalProfit}
ROI: ${roi}%
Marketing: ${useMarketing ? `R$${marketingBudget} (${marketingPeriod})` : "Desativado"}
    `

    if (navigator.share) {
      navigator.share({
        title: "Análise de Precificação",
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Informações copiadas para a área de transferência!")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Calculadora de Preço</CardTitle>
              <CardDescription>Configure os parâmetros para calcular o preço ideal</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="use-global" className="text-sm">
                Usar configurações globais
              </Label>
              <Switch id="use-global" checked={useGlobalSettings} onCheckedChange={setUseGlobalSettings} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-cost">Custo do Produto (R$)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Valor pago pelo produto ao fornecedor, sem incluir frete ou outros custos.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="product-cost"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={productCost}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (!isNaN(value) && value >= 0) {
                        setProductCost(value)
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground w-20">{formatCurrency(productCost)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantity">Quantidade no Lote</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Quantidade de produtos comprados no mesmo lote. Afeta o custo de frete por unidade.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (!isNaN(value) && value >= 1) {
                        setQuantity(value)
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground w-12">{quantity} un</span>
                  <Button variant="outline" size="sm" onClick={suggestQuantity} className="flex items-center">
                    <Lightbulb className="mr-1 h-3.5 w-3.5" />
                    Sugerir
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="profit-margin">Margem de Lucro</Label>
                  <span className="text-sm text-muted-foreground">{profitMargin}%</span>
                </div>
                <Slider
                  id="profit-margin"
                  min={1}
                  max={80}
                  step={1}
                  value={[profitMargin]}
                  onValueChange={(value) => setProfitMargin(value[0])}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shipping-cost">Frete do Lote (R$)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Custo total de frete para o lote inteiro, não por unidade.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="shipping-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (!isNaN(value) && value >= 0) {
                        setShippingCost(value)
                      }
                    }}
                    disabled={useGlobalSettings}
                  />
                  <span className="text-sm text-muted-foreground w-20">{formatCurrency(shippingCost)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="packaging-cost">Embalagem por Unidade (R$)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Custo de embalagem por unidade de produto.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="packaging-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={packagingCost}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (!isNaN(value) && value >= 0) {
                        setPackagingCost(value)
                      }
                    }}
                    disabled={useGlobalSettings}
                  />
                  <span className="text-sm text-muted-foreground w-20">{formatCurrency(packagingCost)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-fee">Taxa do Gateway (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Percentual cobrado pelo processador de pagamento (ex: PayPal, Stripe, Mercado Pago).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="payment-fee"
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={paymentFeePercentage}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (!isNaN(value) && value >= 0 && value <= 20) {
                        setPaymentFeePercentage(value)
                      }
                    }}
                    disabled={useGlobalSettings}
                  />
                  <span className="text-sm text-muted-foreground w-20">{paymentFeePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Marketing */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  Marketing
                  <Badge variant={useMarketing ? "default" : "outline"}>
                    {useMarketing ? "Ativado" : "Desativado"}
                  </Badge>
                </CardTitle>
                <Switch checked={useMarketing} onCheckedChange={setUseMarketing} />
              </div>
              <CardDescription>Ative para incluir custos de marketing na precificação</CardDescription>
            </CardHeader>
            <CardContent className={useMarketing ? "" : "opacity-50 pointer-events-none"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketing-budget">Orçamento de Marketing</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marketing-budget"
                      type="number"
                      min="0"
                      step="1"
                      value={marketingBudget}
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value)
                        if (!isNaN(value) && value >= 0) {
                          setMarketingBudget(value)
                        }
                      }}
                      disabled={useGlobalSettings && useMarketing}
                    />
                    <Button variant="outline" size="sm" onClick={suggestMarketingBudget} className="flex items-center">
                      <Lightbulb className="mr-1 h-3.5 w-3.5" />
                      Sugerir
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketing-period">Período</Label>
                  <Select
                    value={marketingPeriod}
                    onValueChange={setMarketingPeriod}
                    disabled={useGlobalSettings && useMarketing}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                O orçamento de marketing será distribuído entre as vendas esperadas ({settings.expectedMonthlySales}{" "}
                unidades/mês) para calcular o custo por produto.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="viability">Análise de Viabilidade</TabsTrigger>
          <TabsTrigger value="projection">Projeção de Lucro</TabsTrigger>
          <TabsTrigger value="calculations">Cálculos</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Precificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Preço de Venda</p>
                  <p className="text-2xl font-bold">{formatCurrency(sellingPrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lucro por Item</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(profitPerItem)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lucro Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className={`text-2xl font-bold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>{roi}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">Ponto de Equilíbrio</p>
                      <p className="text-xl mt-1">{breakEvenQuantity} unidades</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quantidade mínima para cobrir todos os custos
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">Quantidade Lucrativa</p>
                      <p className="text-xl mt-1">{profitableQuantity} unidades</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quantidade recomendada para lucro satisfatório
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">Custo por Unidade</p>
                      <p className="text-xl mt-1">{formatCurrency(totalCostPerItem)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Custo total por unidade incluindo todos os gastos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <PriceBreakdown
                productCost={productCost}
                shippingCost={shippingCostPerItem}
                packagingCost={packagingCostPerItem}
                marketingCost={marketingCostPerItem}
                paymentFees={paymentFeesPerItem}
                profit={profitPerItem}
              />

              <div className="flex space-x-2 pt-2">
                <Button className="flex-1" onClick={handleSavePrice}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleSharePrice}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viability" className="mt-4">
          <ViabilityAnalysis
            productCost={productCost}
            sellingPrice={sellingPrice}
            profitPerItem={profitPerItem}
            quantity={quantity}
            totalProfit={totalProfit}
            roi={roi}
            breakEvenQuantity={breakEvenQuantity}
          />
        </TabsContent>

        <TabsContent value="projection" className="mt-4">
          <ProfitProjection
            productCost={productCost}
            sellingPrice={sellingPrice}
            shippingCost={shippingCost}
            packagingCost={packagingCost}
            paymentFeePercentage={paymentFeePercentage}
            marketingBudget={useMarketing ? marketingBudget : 0}
            marketingPeriod={marketingPeriod}
          />
        </TabsContent>

        <TabsContent value="calculations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Detalhamento dos Cálculos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {detailedCalculations.map((step, index) => (
                    <div key={index} className="mb-1">
                      {step}
                    </div>
                  ))}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
