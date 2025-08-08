"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight, Copy, Save, Trash } from "lucide-react"

export function ScenarioComparison() {
  // Estados para os cenários
  const [scenarios, setScenarios] = useState([
    {
      id: "scenario-a",
      name: "Cenário A",
      budget: 200,
      targetCPA: 10,
      conversionRate: 2.5,
      averageOrderValue: 150,
      color: "#3b82f6",
    },
    {
      id: "scenario-b",
      name: "Cenário B",
      budget: 300,
      targetCPA: 15,
      conversionRate: 3.0,
      averageOrderValue: 150,
      color: "#10b981",
    },
  ])

  // Calcular métricas para cada cenário
  const scenariosWithMetrics = scenarios.map((scenario) => {
    const conversions = scenario.budget / scenario.targetCPA
    const clicks = (conversions * 100) / scenario.conversionRate
    const cpc = scenario.budget / clicks
    const revenue = conversions * scenario.averageOrderValue
    const profit = revenue - scenario.budget
    const roi = (revenue / scenario.budget - 1) * 100
    const breakEvenConversionRate = (scenario.targetCPA / scenario.averageOrderValue) * 100

    return {
      ...scenario,
      conversions,
      clicks,
      cpc,
      revenue,
      profit,
      roi,
      breakEvenConversionRate,
    }
  })

  // Dados para gráficos comparativos
  const comparisonData = [
    { name: "Orçamento", A: scenariosWithMetrics[0].budget, B: scenariosWithMetrics[1].budget },
    { name: "Conversões", A: scenariosWithMetrics[0].conversions, B: scenariosWithMetrics[1].conversions },
    { name: "Receita", A: scenariosWithMetrics[0].revenue, B: scenariosWithMetrics[1].revenue },
    { name: "Lucro", A: scenariosWithMetrics[0].profit, B: scenariosWithMetrics[1].profit },
  ]

  // Dados para gráfico de ROI
  const roiData = [{ name: "ROI", A: scenariosWithMetrics[0].roi, B: scenariosWithMetrics[1].roi }]

  // Função para atualizar um cenário
  const updateScenario = (id: string, field: string, value: number) => {
    setScenarios(scenarios.map((scenario) => (scenario.id === id ? { ...scenario, [field]: value } : scenario)))
  }

  // Função para adicionar um novo cenário
  const addScenario = () => {
    const newId = `scenario-${String.fromCharCode(67 + scenarios.length)}` // C, D, E, etc.
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

    setScenarios([
      ...scenarios,
      {
        id: newId,
        name: `Cenário ${String.fromCharCode(65 + scenarios.length)}`, // A, B, C, etc.
        budget: 250,
        targetCPA: 12,
        conversionRate: 2.8,
        averageOrderValue: 150,
        color: colors[scenarios.length % colors.length],
      },
    ])
  }

  // Função para remover um cenário
  const removeScenario = (id: string) => {
    if (scenarios.length <= 2) return // Manter pelo menos 2 cenários
    setScenarios(scenarios.filter((scenario) => scenario.id !== id))
  }

  // Função para duplicar um cenário
  const duplicateScenario = (id: string) => {
    const scenarioToDuplicate = scenarios.find((scenario) => scenario.id === id)
    if (!scenarioToDuplicate) return

    const newId = `scenario-${String.fromCharCode(67 + scenarios.length)}` // C, D, E, etc.
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

    setScenarios([
      ...scenarios,
      {
        ...scenarioToDuplicate,
        id: newId,
        name: `${scenarioToDuplicate.name} (cópia)`,
        color: colors[scenarios.length % colors.length],
      },
    ])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Cenários</CardTitle>
          <CardDescription>Compare diferentes cenários de marketing para tomar decisões informadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenariosWithMetrics.map((scenario) => (
              <Card key={scenario.id} className="border-2" style={{ borderColor: scenario.color }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => duplicateScenario(scenario.id)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {scenarios.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => removeScenario(scenario.id)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${scenario.id}-budget`}>Orçamento Mensal (R$)</Label>
                    <Input
                      id={`${scenario.id}-budget`}
                      type="number"
                      min="1"
                      value={scenario.budget}
                      onChange={(e) => updateScenario(scenario.id, "budget", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${scenario.id}-cpa`}>CPA Alvo (R$)</Label>
                    <Input
                      id={`${scenario.id}-cpa`}
                      type="number"
                      min="1"
                      value={scenario.targetCPA}
                      onChange={(e) => updateScenario(scenario.id, "targetCPA", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${scenario.id}-conversion`}>Taxa de Conversão (%)</Label>
                    <Input
                      id={`${scenario.id}-conversion`}
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={scenario.conversionRate}
                      onChange={(e) => updateScenario(scenario.id, "conversionRate", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${scenario.id}-aov`}>Valor Médio do Pedido (R$)</Label>
                    <Input
                      id={`${scenario.id}-aov`}
                      type="number"
                      min="1"
                      value={scenario.averageOrderValue}
                      onChange={(e) => updateScenario(scenario.id, "averageOrderValue", Number(e.target.value))}
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Resultados Projetados</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <MetricBox label="Conversões" value={scenario.conversions.toFixed(0)} color={scenario.color} />
                      <MetricBox label="Cliques" value={scenario.clicks.toFixed(0)} color={scenario.color} />
                      <MetricBox label="CPC" value={formatCurrency(scenario.cpc)} color={scenario.color} />
                      <MetricBox label="Receita" value={formatCurrency(scenario.revenue)} color={scenario.color} />
                      <MetricBox label="Lucro" value={formatCurrency(scenario.profit)} color={scenario.color} />
                      <MetricBox label="ROI" value={`${scenario.roi.toFixed(0)}%`} color={scenario.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {scenarios.length < 4 && (
              <Card className="border-dashed flex items-center justify-center">
                <Button variant="ghost" className="h-full w-full" onClick={addScenario}>
                  Adicionar Cenário
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa</CardTitle>
          <CardDescription>Visualize a comparação entre os cenários</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Métricas Principais</TabsTrigger>
              <TabsTrigger value="roi">ROI</TabsTrigger>
              <TabsTrigger value="breakeven">Ponto de Equilíbrio</TabsTrigger>
            </TabsList>
            <TabsContent value="metrics" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => (typeof value === "number" ? value.toFixed(2) : value)} />
                    <Legend />
                    {scenariosWithMetrics.map((scenario, index) => (
                      <Bar
                        key={scenario.id}
                        dataKey={String.fromCharCode(65 + index)}
                        name={scenario.name}
                        fill={scenario.color}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="roi" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                    {scenariosWithMetrics.map((scenario, index) => (
                      <Bar
                        key={scenario.id}
                        dataKey={String.fromCharCode(65 + index)}
                        name={scenario.name}
                        fill={scenario.color}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="breakeven" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scenariosWithMetrics.map((s) => ({
                      name: s.name,
                      actual: s.conversionRate,
                      breakeven: s.breakEvenConversionRate,
                      color: s.color,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Taxa de Conversão (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Bar dataKey="actual" name="Taxa Atual" fill="#3b82f6" />
                    <Bar dataKey="breakeven" name="Taxa de Equilíbrio" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">
            <Save className="mr-2 h-4 w-4" />
            Salvar Cenários
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface MetricBoxProps {
  label: string
  value: string
  color: string
}

function MetricBox({ label, value, color }: MetricBoxProps) {
  return (
    <div className="rounded-md border p-2 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-1" style={{ color }}>
        {value}
      </p>
    </div>
  )
}
