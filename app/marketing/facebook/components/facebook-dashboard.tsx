"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Dados mockados para o dashboard
const performanceData = [
  { name: "Jan", impressions: 120000, clicks: 3200, ctr: 2.67 },
  { name: "Fev", impressions: 140000, clicks: 3800, ctr: 2.71 },
  { name: "Mar", impressions: 160000, clicks: 4300, ctr: 2.69 },
  { name: "Abr", impressions: 180000, clicks: 4900, ctr: 2.72 },
  { name: "Mai", impressions: 200000, clicks: 5400, ctr: 2.7 },
  { name: "Jun", impressions: 220000, clicks: 6000, ctr: 2.73 },
]

const campaignData = [
  { name: "Campanha 1", impressions: 85000, clicks: 2300, conversions: 120, cpa: 18.5 },
  { name: "Campanha 2", impressions: 65000, clicks: 1800, conversions: 95, cpa: 22.1 },
  { name: "Campanha 3", impressions: 45000, clicks: 1200, conversions: 65, cpa: 25.4 },
  { name: "Campanha 4", impressions: 35000, clicks: 950, conversions: 48, cpa: 28.7 },
]

export function FacebookDashboard({ isConnected }: { isConnected: boolean }) {
  if (!isConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Facebook Ads para visualizar o dashboard.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Desempenho Geral</CardTitle>
          <CardDescription>Impressões e cliques nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressões" />
              <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Cliques" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Desempenho por Campanha</CardTitle>
          <CardDescription>Impressões, cliques e conversões por campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#8884d8" name="Impressões" />
              <Bar dataKey="clicks" fill="#82ca9d" name="Cliques" />
              <Bar dataKey="conversions" fill="#ffc658" name="Conversões" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Principais</CardTitle>
          <CardDescription>Resumo do desempenho atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CTR Médio</span>
              <span className="font-medium">2.71%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CPC Médio</span>
              <span className="font-medium">R$ 0.87</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conversões</span>
              <span className="font-medium">328</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo por Conversão</span>
              <span className="font-medium">R$ 22.45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ROAS</span>
              <span className="font-medium">3.2x</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
