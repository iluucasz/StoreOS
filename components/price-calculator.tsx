"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/settings-context"
import { PriceBreakdown } from "@/components/price-breakdown"
import { Button } from "@/components/ui/button"
import { Save, Share2 } from "lucide-react"

export function PriceCalculator() {
  const { settings } = useSettings()

  const [productCost, setProductCost] = useState(40)
  const [quantity, setQuantity] = useState(5)
  const [profitMargin, setProfitMargin] = useState(30)
  const [sellingPrice, setSellingPrice] = useState(0)
  const [profitPerItem, setProfitPerItem] = useState(0)

  // Calculated costs
  const [shippingCostPerItem, setShippingCostPerItem] = useState(0)
  const [packagingCostPerItem, setPackagingCostPerItem] = useState(0)
  const [marketingCostPerItem, setMarketingCostPerItem] = useState(0)
  const [paymentFeesPerItem, setPaymentFeesPerItem] = useState(0)
  const [totalCostPerItem, setTotalCostPerItem] = useState(0)

  useEffect(() => {
    // Calculate costs per item
    const shippingPerItem = settings.shippingCost / quantity
    const packagingPerItem = settings.packagingCost
    const marketingPerItem = settings.marketingBudget / settings.expectedMonthlySales

    setShippingCostPerItem(shippingPerItem)
    setPackagingCostPerItem(packagingPerItem)
    setMarketingCostPerItem(marketingPerItem)

    // Calculate total cost per item
    const totalCost = productCost + shippingPerItem + packagingPerItem + marketingPerItem
    setTotalCostPerItem(totalCost)

    // Calculate selling price based on profit margin
    const calculatedPrice = totalCost / (1 - profitMargin / 100 - settings.paymentFeePercentage / 100)
    setSellingPrice(Number.parseFloat(calculatedPrice.toFixed(2)))

    // Calculate payment fees
    const fees = calculatedPrice * (settings.paymentFeePercentage / 100)
    setPaymentFeesPerItem(fees)

    // Calculate profit per item
    const profit = calculatedPrice - totalCost - fees
    setProfitPerItem(Number.parseFloat(profit.toFixed(2)))
  }, [productCost, quantity, profitMargin, settings])

  const handleSavePrice = () => {
    // Implement save functionality
    alert("Preço salvo com sucesso!")
  }

  const handleSharePrice = () => {
    // Implement share functionality
    const shareText = `Produto: R${productCost}\nPreço de venda: R${sellingPrice}\nLucro: R${profitPerItem}`

    if (navigator.share) {
      navigator.share({
        title: "Precificação de Produto",
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
          <CardTitle>Calculadora de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-cost">Custo do Produto (R$)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="product-cost"
                type="number"
                min="30"
                max="50"
                value={productCost}
                onChange={(e) => setProductCost(Number.parseFloat(e.target.value))}
              />
              <span className="text-sm text-muted-foreground w-12">R${productCost}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade no Lote</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground w-12">{quantity} un</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="profit-margin">Margem de Lucro</Label>
              <span className="text-sm text-muted-foreground">{profitMargin}%</span>
            </div>
            <Slider
              id="profit-margin"
              min={10}
              max={70}
              step={1}
              value={[profitMargin]}
              onValueChange={(value) => setProfitMargin(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Preço de Venda</p>
              <p className="text-2xl font-bold">R${sellingPrice}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lucro por Item</p>
              <p className="text-2xl font-bold text-green-600">R${profitPerItem}</p>
            </div>
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
    </div>
  )
}
