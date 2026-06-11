"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, FileText, Download, Calendar, BarChart2, PieChart, LineChartIcon, Mail } from "lucide-react"

interface ReportGeneratorProps {
  isConnected: boolean
}

export function ReportGenerator({ isConnected }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState("performance")
  const [timeframe, setTimeframe] = useState("last_30_days")
  const [format, setFormat] = useState("pdf")

  const [selectedMetrics, setSelectedMetrics] = useState({
    impressions: true,
    clicks: true,
    ctr: true,
    cpc: true,
    spend: true,
    conversions: true,
    cpa: true,
    roas: true,
  })

  const [selectedCharts, setSelectedCharts] = useState({
    performanceOverTime: true,
    campaignComparison: true,
    conversionFunnel: true,
    roiAnalysis: true,
  })

  const toggleMetric = (metric: string) => {
    setSelectedMetrics({
      ...selectedMetrics,
      [metric]: !selectedMetrics[metric as keyof typeof selectedMetrics],
    })
  }

  const toggleChart = (chart: string) => {
    setSelectedCharts({
      ...selectedCharts,
      [chart]: !selectedCharts[chart as keyof typeof selectedCharts],
    })
  }

  const generateReport = () => {
    // Implementação da geração de relatório
    alert("Relatório gerado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Relatórios</CardTitle>
          <CardDescription>Crie relatórios personalizados para análise de desempenho de marketing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Desempenho de Campanhas</SelectItem>
                  <SelectItem value="conversion">Análise de Conversão</SelectItem>
                  <SelectItem value="roi">Análise de ROI</SelectItem>
                  <SelectItem value="budget">Análise de Orçamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Período</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                  <SelectItem value="year_to_date">Ano até hoje</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="metrics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Métricas
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Gráficos
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Entrega
              </TabsTrigger>
            </TabsList>
            <TabsContent value="metrics" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CheckboxItem
                  id="metric-impressions"
                  label="Impressões"
                  checked={selectedMetrics.impressions}
                  onCheckedChange={() => toggleMetric("impressions")}
                />
                <CheckboxItem
                  id="metric-clicks"
                  label="Cliques"
                  checked={selectedMetrics.clicks}
                  onCheckedChange={() => toggleMetric("clicks")}
                />
                <CheckboxItem
                  id="metric-ctr"
                  label="CTR"
                  checked={selectedMetrics.ctr}
                  onCheckedChange={() => toggleMetric("ctr")}
                />
                <CheckboxItem
                  id="metric-cpc"
                  label="CPC"
                  checked={selectedMetrics.cpc}
                  onCheckedChange={() => toggleMetric("cpc")}
                />
                <CheckboxItem
                  id="metric-spend"
                  label="Gasto"
                  checked={selectedMetrics.spend}
                  onCheckedChange={() => toggleMetric("spend")}
                />
                <CheckboxItem
                  id="metric-conversions"
                  label="Conversões"
                  checked={selectedMetrics.conversions}
                  onCheckedChange={() => toggleMetric("conversions")}
                />
                <CheckboxItem
                  id="metric-cpa"
                  label="CPA"
                  checked={selectedMetrics.cpa}
                  onCheckedChange={() => toggleMetric("cpa")}
                />
                <CheckboxItem
                  id="metric-roas"
                  label="ROAS"
                  checked={selectedMetrics.roas}
                  onCheckedChange={() => toggleMetric("roas")}
                />
              </div>
            </TabsContent>
            <TabsContent value="charts" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <CheckboxItem
                  id="chart-performance"
                  label="Desempenho ao Longo do Tempo"
                  description="Gráfico de linha mostrando métricas ao longo do tempo"
                  checked={selectedCharts.performanceOverTime}
                  onCheckedChange={() => toggleChart("performanceOverTime")}
                />
                <CheckboxItem
                  id="chart-campaign"
                  label="Comparação de Campanhas"
                  description="Gráfico de barras comparando campanhas"
                  checked={selectedCharts.campaignComparison}
                  onCheckedChange={() => toggleChart("campaignComparison")}
                />
                <CheckboxItem
                  id="chart-funnel"
                  label="Funil de Conversão"
                  description="Visualização do funil de conversão"
                  checked={selectedCharts.conversionFunnel}
                  onCheckedChange={() => toggleChart("conversionFunnel")}
                />
                <CheckboxItem
                  id="chart-roi"
                  label="Análise de ROI"
                  description="Gráfico de ROI por campanha"
                  checked={selectedCharts.roiAnalysis}
                  onCheckedChange={() => toggleChart("roiAnalysis")}
                />
              </div>
            </TabsContent>
            <TabsContent value="delivery" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <CheckboxItem
                    id="delivery-email"
                    label="Enviar por E-mail"
                    description="Enviar relatório para endereços de e-mail"
                    checked={true}
                  />
                  <CheckboxItem
                    id="delivery-schedule"
                    label="Agendar Envio"
                    description="Agendar envio periódico do relatório"
                    checked={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-recipients">Destinatários (separados por vírgula)</Label>
                  <Input id="email-recipients" placeholder="exemplo@email.com, outro@email.com" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Agendar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Visualizar
            </Button>
            <Button className="gap-2" onClick={generateReport}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Salvos</CardTitle>
          <CardDescription>Acesse relatórios gerados anteriormente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Período</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data de Criação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Formato</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm">Relatório de Desempenho Mensal</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <BarChart2 className="h-3.5 w-3.5 text-blue-500" />
                      <span>Desempenho</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">Últimos 30 dias</td>
                  <td className="px-4 py-3 text-sm">15/04/2023</td>
                  <td className="px-4 py-3 text-sm">PDF</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Análise de ROI por Campanha</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <PieChart className="h-3.5 w-3.5 text-green-500" />
                      <span>ROI</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">Últimos 90 dias</td>
                  <td className="px-4 py-3 text-sm">02/04/2023</td>
                  <td className="px-4 py-3 text-sm">Excel</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Funil de Conversão</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <LineChartIcon className="h-3.5 w-3.5 text-purple-500" />
                      <span>Conversão</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">Ano até hoje</td>
                  <td className="px-4 py-3 text-sm">28/03/2023</td>
                  <td className="px-4 py-3 text-sm">PDF</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface CheckboxItemProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange?: () => void
}

function CheckboxItem({ id, label, description, checked, onCheckedChange }: CheckboxItemProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  )
}
