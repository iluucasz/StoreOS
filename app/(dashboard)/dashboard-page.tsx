"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, Package, Facebook } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useProducts } from "@/contexts/products-context"
import { formatCurrency } from "@/lib/utils"

export function DashboardPage() {
  const { products, getTotalProducts, getNewProducts } = useProducts()

  // Mock data for marketing metrics since we removed the sales context
  const marketingData = [
    { date: "01/05", spend: 120, conversions: 10 },
    { date: "02/05", spend: 150, conversions: 12 },
    { date: "03/05", spend: 180, conversions: 15 },
    { date: "04/05", spend: 140, conversions: 11 },
    { date: "05/05", spend: 160, conversions: 13 },
    { date: "06/05", spend: 190, conversions: 16 },
    { date: "07/05", spend: 210, conversions: 18 },
    { date: "08/05", spend: 170, conversions: 14 },
    { date: "09/05", spend: 200, conversions: 17 },
    { date: "10/05", spend: 230, conversions: 20 },
    { date: "11/05", spend: 180, conversions: 15 },
    { date: "12/05", spend: 220, conversions: 19 },
    { date: "13/05", spend: 250, conversions: 22 },
    { date: "14/05", spend: 190, conversions: 16 },
    { date: "15/05", spend: 240, conversions: 21 },
  ]

  // Mock campaign metrics
  const campaignMetrics = {
    totalSpend: 2500,
    conversions: 200,
    spendChange: 15,
    conversionChange: 20,
    roas: 3.5,
    roasChange: 10,
  }

  // Produtos mais recentes
  const recentProducts = getNewProducts(30).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gasto em Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(campaignMetrics.totalSpend)}</div>
            <p className="text-xs text-muted-foreground">
              {campaignMetrics.spendChange >= 0 ? "+" : ""}
              {campaignMetrics.spendChange}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.conversions}</div>
            <p className="text-xs text-muted-foreground">
              {campaignMetrics.conversionChange >= 0 ? "+" : ""}
              {campaignMetrics.conversionChange}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.roas.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">
              {campaignMetrics.roasChange >= 0 ? "+" : ""}
              {campaignMetrics.roasChange}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalProducts()}</div>
            <p className="text-xs text-muted-foreground">+{getNewProducts(30).length} novos este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversões Recentes</CardTitle>
            <CardDescription>Conversões nos últimos 15 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketingData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Conversões"]} />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversões" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos em Marketing</CardTitle>
            <CardDescription>Gastos nos últimos 15 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketingData}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `R${value}`} />
                  <Tooltip formatter={(value) => [`R${value}`, "Gasto"]} />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" name="Gasto (R$)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Calculadora de Preço
            </CardTitle>
            <CardDescription>
              Calcule o preço ideal para seus produtos com base nos custos e margem desejada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Defina o custo do produto, quantidade e margem de lucro para obter o preço de venda recomendado.
            </p>
            <Button asChild className="w-full">
              <Link href="/calculator">
                Acessar Calculadora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Simulador de Cenários
            </CardTitle>
            <CardDescription>Simule diferentes cenários para planejar sua estratégia</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Teste diferentes combinações de preços, custos e volumes para encontrar o ponto de equilíbrio ideal.
            </p>
            <Button asChild className="w-full">
              <Link href="/simulator">
                Acessar Simulador
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Facebook className="mr-2 h-5 w-5 text-primary" />
              Marketing
            </CardTitle>
            <CardDescription>Gerencie suas campanhas de marketing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integre com Facebook Business, analise métricas e otimize suas campanhas de marketing.
            </p>
            <Button asChild className="w-full">
              <Link href="/marketing">
                Acessar Marketing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Produtos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <li key={product.id} className="flex justify-between items-center text-sm">
                  <span>{product.name}</span>
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Nenhum produto adicionado recentemente</li>
            )}
          </ul>
          <Button variant="outline" asChild className="w-full mt-4">
            <Link href="/products">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
