"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { mockMarketingData } from "@/app/marketing/data/mock-data"
import { formatCurrency } from "@/lib/utils"
import { Save, PieChartIcon, BarChartIcon, RefreshCw } from "lucide-react"

interface BudgetPlannerProps {
  isConnected: boolean
}

export function BudgetPlanner({ isConnected }: BudgetPlannerProps) {
  const { campaigns, budgetAllocation } = mockMarketingData
  const [totalBudget, setTotalBudget] = useState(1000)
  const [allocations, setAllocations] = useState(budgetAllocation)

  // Calcular a soma total das alocações
  const totalAllocated = allocations.reduce((sum, item) => sum + item.value, 0)
  const remainingBudget = totalBudget - totalAllocated

  // Função para atualizar a alocação de uma campanha
  const updateAllocation = (id: string, newValue: number) => {
    // Garantir que o valor não exceda o orçamento total
    if (newValue > totalBudget) return

    // Calcular quanto já foi alocado para outras campanhas
    const otherAllocations = allocations.filter((item) => item.id !== id).reduce((sum, item) => sum + item.value, 0)

    // Verificar se a nova alocação excederia o orçamento total
    if (otherAllocations + newValue > totalBudget) {
      newValue = totalBudget - otherAllocations
    }

    // Atualizar a alocação
    const updatedAllocations = allocations.map((item) => (item.id === id ? { ...item, value: newValue } : item))

    setAllocations(updatedAllocations)
  }

  // Função para otimizar a alocação com base no ROAS
  const optimizeAllocation = () => {
    // Obter o ROAS de cada campanha
    const campaignsWithRoas = campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      roas: campaign.roas,
    }))

    // Calcular o total de ROAS
    const totalRoas = campaignsWithRoas.reduce((sum, campaign) => sum + campaign.roas, 0)

    // Alocar o orçamento proporcionalmente ao ROAS
    const newAllocations = allocations.map((item) => {
      const campaign = campaignsWithRoas.find((c) => c.id === item.id)
      if (!campaign) return item

      // Calcular a proporção do orçamento com base no ROAS
      const proportion = campaign.roas / totalRoas
      const newValue = Math.round(totalBudget * proportion)

      return { ...item, value: newValue }
    })

    setAllocations(newAllocations)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planejador de Orçamento</CardTitle>
          <CardDescription>Distribua seu orçamento de marketing entre campanhas e plataformas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="total-budget">Orçamento Total Mensal (R$)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="total-budget"
                  type="number"
                  min="0"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                />
                <Button variant="outline" size="sm" onClick={optimizeAllocation} className="whitespace-nowrap">
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Otimizar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Orçamento Alocado</Label>
                <span className="text-sm font-medium">
                  {formatCurrency(totalAllocated)} / {formatCurrency(totalBudget)}
                </span>
              </div>
              <Progress value={(totalAllocated / totalBudget) * 100} className="h-2.5" />
              <p className="text-xs text-muted-foreground">Restante: {formatCurrency(remainingBudget)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Alocação por Campanha</h3>
            {allocations.map((allocation) => (
              <div key={allocation.id} className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={`allocation-${allocation.id}`}>{allocation.name}</Label>
                  <span className="text-sm font-medium">
                    {formatCurrency(allocation.value)} ({Math.round((allocation.value / totalBudget) * 100)}%)
                  </span>
                </div>
                <Slider
                  id={`allocation-${allocation.id}`}
                  min={0}
                  max={totalBudget}
                  step={10}
                  value={[allocation.value]}
                  onValueChange={(value) => updateAllocation(allocation.id, value[0])}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Resetar</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alocação
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualização da Alocação</CardTitle>
          <CardDescription>Veja como seu orçamento está distribuído</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pie">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Gráfico de Pizza
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4" />
                Gráfico de Barras
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pie" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocations}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {allocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="bar" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allocations}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8">
                      {allocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
