"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { SimulatorData } from "../advanced-simulator"
import { Sparkles, DollarSign, Package, Tag, Megaphone, Calendar, TrendingUp, TagIcon as PriceTag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useSettings } from "@/contexts/settings-context"

interface BasicInfoStepProps {
  data: SimulatorData
  updateData: (data: Partial<SimulatorData>) => void
  results?: any
  isCalculating?: boolean
}

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const { settings } = useSettings()
  const [totalValue, setTotalValue] = useState(data.productQuantity * data.averageUnitCost)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)

  // Calcular o preço sugerido com base nos custos e margem
  useEffect(() => {
    const costPerProduct = data.averageUnitCost
    const marketingCostPerProduct = data.marketingBudget / data.productQuantity
    const totalCostPerProduct = costPerProduct + marketingCostPerProduct

    // Preço de venda baseado na margem desejada
    const suggestedPrice =
      totalCostPerProduct / (1 - data.desiredProfitMargin / 100 - settings.paymentFeePercentage / 100)

    setCalculatedPrice(suggestedPrice)

    // Se não estiver usando preço personalizado, atualizar o preço de venda com o calculado
    if (!data.useCustomSellingPrice) {
      updateData({ sellingPrice: suggestedPrice })
    }
  }, [
    data.averageUnitCost,
    data.marketingBudget,
    data.productQuantity,
    data.desiredProfitMargin,
    settings.paymentFeePercentage,
    data.useCustomSellingPrice,
  ])

  const handleQuantityChange = (value: number) => {
    updateData({ productQuantity: value })
    setTotalValue(value * data.averageUnitCost)
  }

  const handleCostChange = (value: number) => {
    updateData({ averageUnitCost: value })
    setTotalValue(data.productQuantity * value)
  }

  const suggestMarketingBudget = () => {
    // Sugestão baseada em 30-40% do valor total dos produtos
    const suggestedBudget = Math.round(totalValue * 0.35)
    updateData({ marketingBudget: suggestedBudget })
  }

  const suggestProfitMargin = () => {
    // Sugestão de margem de lucro entre 20-30%
    const suggestedMargin = 25
    updateData({ desiredProfitMargin: suggestedMargin })
  }

  const suggestSellingPrice = () => {
    if (calculatedPrice) {
      // Adicionar um pequeno ajuste para arredondar para um valor mais "comercial"
      const roundedPrice = Math.ceil(calculatedPrice / 10) * 10 - 0.1
      updateData({ sellingPrice: roundedPrice, useCustomSellingPrice: true })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome do cenário */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <Label htmlFor="scenario-name" className="font-medium text-base">
                Nome do cenário
              </Label>
            </div>
            <Input
              id="scenario-name"
              value={data.scenarioName}
              onChange={(e) => updateData({ scenarioName: e.target.value })}
              placeholder="Ex: Lançamento Outono"
              className="border-2 focus-visible:ring-1"
            />
          </CardContent>
        </Card>

        {/* Quantidade de produtos */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <Label htmlFor="product-quantity" className="font-medium text-base">
                Quantidade de produtos
              </Label>
            </div>
            <div className="flex flex-col space-y-2">
              <Input
                id="product-quantity"
                type="number"
                min="1"
                value={data.productQuantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="border-2 focus-visible:ring-1"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valor total:</span>
                <span className="font-medium">{formatCurrency(totalValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custo unitário médio */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <Label htmlFor="average-cost" className="font-medium text-base">
                Custo unitário médio
              </Label>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="average-cost"
                  type="number"
                  min="30"
                  max="50"
                  value={data.averageUnitCost}
                  onChange={(e) => handleCostChange(Number(e.target.value))}
                  className="border-2 focus-visible:ring-1"
                />
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">R$</span>
              </div>
              <p className="text-xs text-muted-foreground">Valor recomendado entre R$30 e R$50</p>
            </div>
          </CardContent>
        </Card>

        {/* Investimento em marketing */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <Label htmlFor="marketing-budget" className="font-medium text-base">
                  Investimento em marketing
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={suggestMarketingBudget} className="h-8">
                <Sparkles className="mr-1 h-3 w-3" />
                Sugerir
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="marketing-budget"
                type="number"
                min="0"
                value={data.marketingBudget}
                onChange={(e) => updateData({ marketingBudget: Number(e.target.value) })}
                className="border-2 focus-visible:ring-1"
              />
              <span className="text-sm font-medium bg-muted px-2 py-1 rounded">R$</span>
            </div>
          </CardContent>
        </Card>

        {/* Período de marketing */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <Label htmlFor="marketing-period" className="font-medium text-base">
                  Período de marketing
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateData({ marketingPeriod: "monthly" })}
                className="h-8"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Sugerir
              </Button>
            </div>
            <Select
              value={data.marketingPeriod}
              onValueChange={(value) =>
                updateData({
                  marketingPeriod: value as "weekly" | "monthly" | "quarterly",
                })
              }
            >
              <SelectTrigger className="border-2 focus-visible:ring-1">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">
                  Semanal ({formatCurrency(Math.round(data.marketingBudget / 4))}/semana)
                </SelectItem>
                <SelectItem value="monthly">Mensal ({formatCurrency(data.marketingBudget)}/mês)</SelectItem>
                <SelectItem value="quarterly">
                  Trimestral ({formatCurrency(data.marketingBudget * 3)}/trimestre)
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Preço de venda */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PriceTag className="h-5 w-5 text-primary" />
                <Label htmlFor="selling-price" className="font-medium text-base">
                  Preço de venda
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={suggestSellingPrice} className="h-8">
                <Sparkles className="mr-1 h-3 w-3" />
                Sugerir
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-2 border-2 rounded-md mb-2">
              <Switch
                id="use-custom-price"
                checked={data.useCustomSellingPrice}
                onCheckedChange={(checked) => {
                  updateData({
                    useCustomSellingPrice: checked,
                    sellingPrice: checked ? data.sellingPrice || calculatedPrice : calculatedPrice,
                  })
                }}
              />
              <div className="flex flex-col">
                <Label htmlFor="use-custom-price" className="cursor-pointer">
                  Definir preço de venda manualmente
                </Label>
                <span className="text-xs text-muted-foreground">
                  {data.useCustomSellingPrice ? "Preço definido manualmente" : "Preço calculado com base na margem"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="selling-price"
                type="number"
                min="0"
                step="0.01"
                value={data.useCustomSellingPrice ? data.sellingPrice || "" : calculatedPrice?.toFixed(2) || ""}
                onChange={(e) => updateData({ sellingPrice: Number(e.target.value) })}
                disabled={!data.useCustomSellingPrice}
                className="border-2 focus-visible:ring-1"
              />
              <span className="text-sm font-medium bg-muted px-2 py-1 rounded">R$</span>
            </div>
            {!data.useCustomSellingPrice && (
              <p className="text-xs text-muted-foreground">
                Preço calculado automaticamente com base na margem de lucro
              </p>
            )}
          </CardContent>
        </Card>

        {/* Margem de lucro desejada - REDESENHADO */}
        <Card className={`border shadow-sm ${data.useCustomSellingPrice ? "opacity-50" : ""}`}>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <Label htmlFor="profit-margin" className="font-medium text-base">
                  Margem de lucro desejada
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={suggestProfitMargin}
                className="h-8"
                disabled={data.useCustomSellingPrice}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Sugerir
              </Button>
            </div>

            {/* Novo layout para o slider de margem */}
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <div
                  className={`text-2xl font-bold ${
                    data.useCustomSellingPrice ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  {data.desiredProfitMargin}%
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {data.desiredProfitMargin < 15 && "Baixa"}
                  {data.desiredProfitMargin >= 15 && data.desiredProfitMargin < 30 && "Média"}
                  {data.desiredProfitMargin >= 30 && data.desiredProfitMargin < 50 && "Alta"}
                  {data.desiredProfitMargin >= 50 && "Muito alta"}
                </div>
              </div>

              <div className="relative pt-1">
                <Slider
                  id="profit-margin"
                  min={5}
                  max={70}
                  step={1}
                  value={[data.desiredProfitMargin]}
                  onValueChange={(value) => updateData({ desiredProfitMargin: value[0] })}
                  disabled={data.useCustomSellingPrice}
                  className="my-2"
                />

                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground mb-1"></div>
                    <span>5%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground mb-1"></div>
                    <span>15%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground mb-1"></div>
                    <span>30%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground mb-1"></div>
                    <span>50%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground mb-1"></div>
                    <span>70%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm">
                {data.useCustomSellingPrice ? (
                  <p className="text-muted-foreground italic">Desativado quando o preço é definido manualmente</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        data.desiredProfitMargin < 15
                          ? "bg-red-500"
                          : data.desiredProfitMargin < 30
                            ? "bg-yellow-500"
                            : data.desiredProfitMargin < 50
                              ? "bg-green-500"
                              : "bg-blue-500"
                      }`}
                    ></div>
                    <p>
                      {data.desiredProfitMargin < 15 &&
                        "Margem baixa, considere aumentar para melhorar a lucratividade"}
                      {data.desiredProfitMargin >= 15 &&
                        data.desiredProfitMargin < 30 &&
                        "Margem adequada para a maioria dos produtos"}
                      {data.desiredProfitMargin >= 30 &&
                        data.desiredProfitMargin < 50 &&
                        "Margem alta, ideal para produtos premium"}
                      {data.desiredProfitMargin >= 50 && "Margem muito alta, verifique a competitividade do preço"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
