"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, BarChart2, Clock, TrendingUp, ArrowUpRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const pageViewsData = [
  { date: "01/07", pageviews: 1200, uniquePageviews: 980 },
  { date: "02/07", pageviews: 1300, uniquePageviews: 1050 },
  { date: "03/07", pageviews: 1400, uniquePageviews: 1100 },
  { date: "04/07", pageviews: 1350, uniquePageviews: 1080 },
  { date: "05/07", pageviews: 1500, uniquePageviews: 1200 },
  { date: "06/07", pageviews: 1600, uniquePageviews: 1300 },
  { date: "07/07", pageviews: 1450, uniquePageviews: 1150 },
  { date: "08/07", pageviews: 1550, uniquePageviews: 1250 },
  { date: "09/07", pageviews: 1650, uniquePageviews: 1350 },
  { date: "10/07", pageviews: 1700, uniquePageviews: 1400 },
  { date: "11/07", pageviews: 1800, uniquePageviews: 1500 },
  { date: "12/07", pageviews: 1750, uniquePageviews: 1450 },
  { date: "13/07", pageviews: 1850, uniquePageviews: 1550 },
  { date: "14/07", pageviews: 1900, uniquePageviews: 1600 },
]

const topPagesData = [
  {
    page: "/home",
    pageviews: 5200,
    uniquePageviews: 4100,
    avgTimeOnPage: "2:15",
    entrances: 3200,
    bounceRate: 42,
    exitRate: 38,
  },
  {
    page: "/products",
    pageviews: 4800,
    uniquePageviews: 3800,
    avgTimeOnPage: "3:05",
    entrances: 2100,
    bounceRate: 35,
    exitRate: 30,
  },
  {
    page: "/blog",
    pageviews: 3500,
    uniquePageviews: 2900,
    avgTimeOnPage: "4:20",
    entrances: 1800,
    bounceRate: 28,
    exitRate: 25,
  },
  {
    page: "/about",
    pageviews: 2200,
    uniquePageviews: 1900,
    avgTimeOnPage: "1:45",
    entrances: 950,
    bounceRate: 45,
    exitRate: 40,
  },
  {
    page: "/contact",
    pageviews: 1800,
    uniquePageviews: 1600,
    avgTimeOnPage: "1:30",
    entrances: 750,
    bounceRate: 38,
    exitRate: 65,
  },
  {
    page: "/pricing",
    pageviews: 1500,
    uniquePageviews: 1300,
    avgTimeOnPage: "2:50",
    entrances: 620,
    bounceRate: 32,
    exitRate: 28,
  },
  {
    page: "/features",
    pageviews: 1300,
    uniquePageviews: 1100,
    avgTimeOnPage: "2:35",
    entrances: 480,
    bounceRate: 36,
    exitRate: 32,
  },
]

interface AnalyticsEngagementProps {
  isConnected: boolean
}

export function AnalyticsEngagement({ isConnected }: AnalyticsEngagementProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre o engajamento dos usuários.
        </p>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          Conectar ao Google Analytics
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Página</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,532</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +8.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio na Página</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                -2.1% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas por Sessão</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +5.7% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualizações de Página</CardTitle>
          <CardDescription>Visualizações de página e visualizações únicas nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pageViewsData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pageviews"
                  name="Visualizações de Página"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="uniquePageviews"
                  name="Visualizações Únicas"
                  stroke="#93C5FD"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Páginas Mais Visitadas</CardTitle>
          <CardDescription>Desempenho das páginas mais visitadas do site</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Página</TableHead>
                <TableHead className="text-right">Visualizações</TableHead>
                <TableHead className="text-right">Visualizações Únicas</TableHead>
                <TableHead className="text-right">Tempo Médio</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Taxa de Rejeição</TableHead>
                <TableHead className="text-right">Taxa de Saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPagesData.map((row) => (
                <TableRow key={row.page}>
                  <TableCell className="font-medium">{row.page}</TableCell>
                  <TableCell className="text-right">{row.pageviews.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.uniquePageviews.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.avgTimeOnPage}</TableCell>
                  <TableCell className="text-right">{row.entrances.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.bounceRate}%</TableCell>
                  <TableCell className="text-right">{row.exitRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
