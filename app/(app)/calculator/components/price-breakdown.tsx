"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"

interface PriceBreakdownProps {
  productCost: number
  shippingCost: number
  packagingCost: number
  marketingCost: number
  paymentFees: number
  profit: number
}

export function PriceBreakdown({
  productCost,
  shippingCost,
  packagingCost,
  marketingCost,
  paymentFees,
  profit,
}: PriceBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calcular o preço total
  const totalPrice = productCost + shippingCost + packagingCost + marketingCost + paymentFees + profit

  // Função para calcular a porcentagem de cada componente no preço total
  const getPercentage = (value: number) => {
    if (totalPrice <= 0) return 0
    return (value / totalPrice) * 100
  }

  // Garantir que o valor do Progress seja válido
  const safeProgressValue = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return 0
    if (value > 100) return 100
    return value
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Descrições para tooltips
  const descriptions = {
    productCost: "Valor pago pelo produto ao fornecedor, sem incluir outros custos.",
    shippingCost: "Custo de frete dividido pelo número de unidades no lote.",
    packagingCost: "Custo de embalagem por unidade de produto.",
    marketingCost: "Orçamento de marketing dividido pelo número esperado de vendas mensais.",
    paymentFees: "Taxa cobrada pelo processador de pagamento (ex: PayPal, Stripe).",
    profit: "Lucro líquido por unidade após todos os custos.",
  }

  // Determinar a cor para o componente de lucro
  const getProfitColor = () => {
    if (profit <= 0) return "bg-red-600"
    return "bg-green-600"
  }

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-2 h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Detalhamento do Preço</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Custo do Produto</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{descriptions.productCost}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <span>{formatCurrency(productCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(productCost))}</span>
              </div>
            </div>
            <Progress value={safeProgressValue(getPercentage(productCost))} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Frete</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{descriptions.shippingCost}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <span>{formatCurrency(shippingCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(shippingCost))}</span>
              </div>
            </div>
            <Progress value={safeProgressValue(getPercentage(shippingCost))} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Embalagem</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{descriptions.packagingCost}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <span>{formatCurrency(packagingCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(packagingCost))}</span>
              </div>
            </div>
            <Progress value={safeProgressValue(getPercentage(packagingCost))} className="h-1" />
          </div>

          {marketingCost > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span>Marketing</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{descriptions.marketingCost}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex space-x-2">
                  <span>{formatCurrency(marketingCost)}</span>
                  <span className="text-muted-foreground">{formatPercentage(getPercentage(marketingCost))}</span>
                </div>
              </div>
              <Progress value={safeProgressValue(getPercentage(marketingCost))} className="h-1" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Taxa de Pagamento</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{descriptions.paymentFees}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <span>{formatCurrency(paymentFees)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(paymentFees))}</span>
              </div>
            </div>
            <Progress value={safeProgressValue(getPercentage(paymentFees))} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <div className="flex items-center gap-1">
                <span>Lucro</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{descriptions.profit}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(profit)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(profit))}</span>
              </div>
            </div>
            <Progress value={safeProgressValue(getPercentage(profit))} className="h-1 bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full rounded-full ${getProfitColor()}`}
                style={{ width: `${safeProgressValue(getPercentage(profit))}%` }}
              />
            </Progress>
          </div>
        </div>
      )}
    </div>
  )
}
