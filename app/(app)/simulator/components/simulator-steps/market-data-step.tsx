"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SimulatorData } from "../advanced-simulator"
import { Sparkles, Users, CalendarDays, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MarketDataStepProps {
  data: SimulatorData
  updateData: (data: Partial<SimulatorData>) => void
  results?: any
  isCalculating?: boolean
}

export function MarketDataStep({ data, updateData }: MarketDataStepProps) {
  const suggestMonthlySales = () => {
    // Sugestão baseada na quantidade de produtos e público-alvo
    let baseSales = data.productQuantity * 0.8

    // Ajuste baseado no público-alvo
    switch (data.targetAudience) {
      case "niche":
        baseSales *= 0.7
        break
      case "mid":
        baseSales *= 1.0
        break
      case "mass":
        baseSales *= 1.3
        break
    }

    // Ajuste baseado na sazonalidade
    switch (data.seasonality) {
      case "low":
        baseSales *= 0.8
        break
      case "normal":
        baseSales *= 1.0
        break
      case "high":
        baseSales *= 1.3
        break
    }

    // Garantir que não exceda a quantidade de produtos
    const suggestedSales = Math.min(Math.round(baseSales), data.productQuantity)
    updateData({ estimatedMonthlySales: suggestedSales })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Público-alvo */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <Label htmlFor="target-audience" className="font-medium text-base">
                Público-alvo
              </Label>
            </div>
            <Select
              value={data.targetAudience}
              onValueChange={(value) =>
                updateData({
                  targetAudience: value as "niche" | "mid" | "mass",
                })
              }
            >
              <SelectTrigger id="target-audience" className="border-2 focus-visible:ring-1">
                <SelectValue placeholder="Selecione o público-alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="niche">
                  <div className="flex flex-col">
                    <span>Nicho (específico)</span>
                    <span className="text-xs text-muted-foreground">Público menor, mas mais especializado</span>
                  </div>
                </SelectItem>
                <SelectItem value="mid">
                  <div className="flex flex-col">
                    <span>Intermediário</span>
                    <span className="text-xs text-muted-foreground">Equilíbrio entre tamanho e especificidade</span>
                  </div>
                </SelectItem>
                <SelectItem value="mass">
                  <div className="flex flex-col">
                    <span>Massa (amplo)</span>
                    <span className="text-xs text-muted-foreground">Público maior, menos específico</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Define seu mercado-alvo e impacta vendas e preços</p>
          </CardContent>
        </Card>

        {/* Sazonalidade do mercado */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <Label htmlFor="seasonality" className="font-medium text-base">
                Sazonalidade do mercado
              </Label>
            </div>
            <Select
              value={data.seasonality}
              onValueChange={(value) =>
                updateData({
                  seasonality: value as "low" | "normal" | "high",
                })
              }
            >
              <SelectTrigger id="seasonality" className="border-2 focus-visible:ring-1">
                <SelectValue placeholder="Selecione a sazonalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex flex-col">
                    <span>Baixa temporada</span>
                    <span className="text-xs text-muted-foreground">Período com menor demanda</span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex flex-col">
                    <span>Temporada normal</span>
                    <span className="text-xs text-muted-foreground">Período com demanda regular</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex flex-col">
                    <span>Alta temporada</span>
                    <span className="text-xs text-muted-foreground">Período com maior demanda</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Ajusta as estimativas de vendas conforme a temporada</p>
          </CardContent>
        </Card>

        {/* Vendas estimadas por mês */}
        <Card className="border shadow-sm col-span-1 md:col-span-2">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <Label htmlFor="estimated-sales" className="font-medium text-base">
                  Vendas estimadas por mês
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={suggestMonthlySales} className="h-8">
                <Sparkles className="mr-1 h-3 w-3" />
                Sugerir
              </Button>
            </div>
            <div className="flex flex-col space-y-2">
              <Input
                id="estimated-sales"
                type="number"
                min="1"
                max={data.productQuantity}
                value={data.estimatedMonthlySales}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  // Garantir que não exceda a quantidade de produtos
                  const limitedValue = Math.min(value, data.productQuantity)
                  updateData({ estimatedMonthlySales: limitedValue })
                }}
                className="border-2 focus-visible:ring-1"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Estimativa mensal de quantos produtos você espera vender
                </p>
                <p className="text-xs font-medium text-amber-600">Máximo: {data.productQuantity} unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Dica de mercado</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Considere a sazonalidade e o público-alvo ao estimar suas vendas. Produtos para nichos específicos geralmente
          têm margens maiores, enquanto produtos para o mercado de massa costumam ter volumes maiores de venda.
        </p>
      </div>
    </div>
  )
}
