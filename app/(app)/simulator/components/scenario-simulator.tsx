"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/settings-context"
import { ScenarioChart } from "@/app/(app)/simulator/components/scenario-chart"
import { Button } from "@/components/ui/button"
import { DownloadIcon, RefreshCw } from "lucide-react"

export function ScenarioSimulator() {
  const { settings } = useSettings()

  const [totalProducts, setTotalProducts] = useState(50)
  const [averageProductCost, setAverageProductCost] = useState(40)
  const [marketingBudget, setMarketingBudget] = useState(settings.marketingBudget)
  const [desiredProfit, setDesiredProfit] = useState(30)
  const [requiredSales, setRequiredSales] = useState(0)
  const [breakEvenSales, setBreakEvenSales] = useState(0)

  // Calculated values
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [revenuePerSale, setRevenuePerSale] = useState(0)
  const [profitPerSale, setProfitPerSale] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Calculate total investment
    const productInvestment = totalProducts * averageProductCost
    const shippingInvestment = Math.ceil(totalProducts / 10) * settings.shippingCost // Assuming 10 products per shipment
    const packagingInvestment = totalProducts * settings.packagingCost
    const totalInv = productInvestment + shippingInvestment + packagingInvestment + marketingBudget
    setTotalInvestment(totalInv)

    // Calculate revenue and profit per sale
    const costPerProduct = averageProductCost + settings.shippingCost / 10 + settings.packagingCost
    const marketingCostPerProduct = marketingBudget / totalProducts
    const totalCostPerProduct = costPerProduct + marketingCostPerProduct

    // Calculate selling price based on desired profit
    const sellingPrice = totalCostPerProduct / (1 - desiredProfit / 100 - settings.paymentFeePercentage / 100)
    const paymentFee = sellingPrice * (settings.paymentFeePercentage / 100)
    const profitAmount = sellingPrice - totalCostPerProduct - paymentFee

    setRevenuePerSale(sellingPrice)
    setProfitPerSale(profitAmount)

    // Calculate required sales to reach desired profit
    const totalDesiredProfit = totalInv * (desiredProfit / 100)
    const requiredSalesToReachProfit = Math.ceil(totalDesiredProfit / profitAmount)
    setRequiredSales(requiredSalesToReachProfit)

    // Calculate break-even point
    const breakEvenPoint = Math.ceil(totalInv / (sellingPrice - costPerProduct - paymentFee))
    setBreakEvenSales(breakEvenPoint)

    // Generate chart data
    const newChartData = []
    for (let i = 0; i <= totalProducts; i += Math.max(1, Math.floor(totalProducts / 10))) {
      const sales = i
      const revenue = sales * sellingPrice
      const costs = totalInv
      const profit = revenue - costs - sales * paymentFee

      newChartData.push({
        sales,
        revenue,
        costs,
        profit,
      })
    }
    setChartData(newChartData)
  }, [totalProducts, averageProductCost, marketingBudget, desiredProfit, settings])

  const resetSimulation = () => {
    setTotalProducts(50)
    setAverageProductCost(40)
    setMarketingBudget(settings.marketingBudget)
    setDesiredProfit(30)
  }

  const downloadReport = () => {
    // Create report content
    const report = `
      Simulação de Cenário - Precificador de Produtos
      ===============================================
      
      Parâmetros:
      - Total de Produtos: ${totalProducts}
      - Custo Médio por Produto: R${averageProductCost.toFixed(2)}
      - Orçamento de Marketing: R${marketingBudget.toFixed(2)}
      - Lucro Desejado: ${desiredProfit}%
      
      Resultados:
      - Investimento Total: R${totalInvestment.toFixed(2)}
      - Preço de Venda por Produto: R${revenuePerSale.toFixed(2)}
      - Lucro por Venda: R${profitPerSale.toFixed(2)}
      - Vendas Necessárias para Lucro Desejado: ${requiredSales}
      - Ponto de Equilíbrio (Break-even): ${breakEvenSales}
      
      Gerado em: ${new Date().toLocaleString()}
    `

    // Create blob and download
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "simulacao-cenario.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Cenários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total-products">Total de Produtos Comprados</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="total-products"
                type="number"
                min="1"
                value={totalProducts}
                onChange={(e) => setTotalProducts(Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground w-12">{totalProducts} un</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="average-cost">Custo Médio por Produto (R$)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="average-cost"
                type="number"
                min="30"
                max="50"
                value={averageProductCost}
                onChange={(e) => setAverageProductCost(Number.parseFloat(e.target.value))}
              />
              <span className="text-sm text-muted-foreground w-12">R${averageProductCost}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketing-budget">Orçamento de Marketing (R$)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="marketing-budget"
                type="number"
                min="0"
                value={marketingBudget}
                onChange={(e) => setMarketingBudget(Number.parseFloat(e.target.value))}
              />
              <span className="text-sm text-muted-foreground w-12">R${marketingBudget}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="desired-profit">Lucro Desejado</Label>
              <span className="text-sm text-muted-foreground">{desiredProfit}%</span>
            </div>
            <Slider
              id="desired-profit"
              min={5}
              max={70}
              step={1}
              value={[desiredProfit]}
              onValueChange={(value) => setDesiredProfit(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados da Simulação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Investimento Total</p>
              <p className="text-xl font-bold">R${totalInvestment.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Preço de Venda</p>
              <p className="text-xl font-bold">R${revenuePerSale.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vendas Necessárias</p>
              <p className="text-xl font-bold">{requiredSales} unidades</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ponto de Equilíbrio</p>
              <p className="text-xl font-bold">{breakEvenSales} unidades</p>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ScenarioChart data={chartData} breakEven={breakEvenSales} requiredSales={requiredSales} />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={resetSimulation}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
            <Button className="flex-1" onClick={downloadReport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
