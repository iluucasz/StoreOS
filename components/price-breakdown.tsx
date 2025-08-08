"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

  const totalPrice = productCost + shippingCost + packagingCost + marketingCost + paymentFees + profit

  const getPercentage = (value: number) => {
    return (value / totalPrice) * 100
  }

  const formatCurrency = (value: number) => {
    return `R${value.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
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
              <span>Custo do Produto</span>
              <div className="flex space-x-2">
                <span>{formatCurrency(productCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(productCost))}</span>
              </div>
            </div>
            <Progress value={getPercentage(productCost)} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Frete</span>
              <div className="flex space-x-2">
                <span>{formatCurrency(shippingCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(shippingCost))}</span>
              </div>
            </div>
            <Progress value={getPercentage(shippingCost)} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Embalagem</span>
              <div className="flex space-x-2">
                <span>{formatCurrency(packagingCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(packagingCost))}</span>
              </div>
            </div>
            <Progress value={getPercentage(packagingCost)} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Marketing</span>
              <div className="flex space-x-2">
                <span>{formatCurrency(marketingCost)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(marketingCost))}</span>
              </div>
            </div>
            <Progress value={getPercentage(marketingCost)} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Taxa de Pagamento</span>
              <div className="flex space-x-2">
                <span>{formatCurrency(paymentFees)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(paymentFees))}</span>
              </div>
            </div>
            <Progress value={getPercentage(paymentFees)} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Lucro</span>
              <div className="flex space-x-2">
                <span className="text-green-600">{formatCurrency(profit)}</span>
                <span className="text-muted-foreground">{formatPercentage(getPercentage(profit))}</span>
              </div>
            </div>
            <Progress value={getPercentage(profit)} className="h-1 bg-gray-200 dark:bg-gray-700">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${getPercentage(profit)}%` }} />
            </Progress>
          </div>
        </div>
      )}
    </div>
  )
}
