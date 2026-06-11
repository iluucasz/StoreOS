"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAnalyticsData, NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsEngagementProps {
  isConnected: boolean
}

type EngagementData = {
  engagementData: { date: string; pageviews: number; avgSessionDuration: number; bounceRate: number }[]
  pageData: { page: string; pageviews: number; avgTimeOnPage: string; bounceRate: string }[]
  deviceData: { device: string; sessions: number; avgSessionDuration: string; bounceRate: string }[]
}

export function AnalyticsEngagement({ isConnected }: AnalyticsEngagementProps) {
  const { data, loading, error } = useAnalyticsData<EngagementData>("/api/google-analytics/engagement", isConnected)

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { engagementData, pageData, deviceData } = data
  const deviceChart = deviceData.map((d) => ({ name: d.device, value: d.sessions }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Engajamento</CardTitle>
          <CardDescription>Visualizações, duração da sessão e taxa de rejeição (7 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pageviews">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pageviews">Visualizações</TabsTrigger>
              <TabsTrigger value="duration">Duração</TabsTrigger>
              <TabsTrigger value="bounce">Taxa de Rejeição</TabsTrigger>
            </TabsList>
            <TabsContent value="pageviews" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pageviews" stroke="#4285F4" name="Visualizações" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="duration" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}s`, "Duração Média"]} />
                    <Line type="monotone" dataKey="avgSessionDuration" stroke="#0F9D58" name="Duração Média (s)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="bounce" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Taxa de Rejeição"]} />
                    <Line type="monotone" dataKey="bounceRate" stroke="#DB4437" name="Taxa de Rejeição (%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Páginas Mais Visitadas</CardTitle>
          <CardDescription>Desempenho das principais páginas (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {pageData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Sem dados de páginas no período.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Página</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Tempo Médio</TableHead>
                    <TableHead>Taxa de Rejeição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((page) => (
                    <TableRow key={page.page}>
                      <TableCell className="font-medium">{page.page}</TableCell>
                      <TableCell>{page.pageviews.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{page.avgTimeOnPage}</TableCell>
                      <TableCell>{page.bounceRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engajamento por Dispositivo</CardTitle>
          <CardDescription>Comparação de métricas entre dispositivos (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceChart}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [Number(value ?? 0).toLocaleString("pt-BR"), "Sessões"]} />
                  <Bar dataKey="value" fill="#F4B400" name="Sessões" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Sessões</TableHead>
                    <TableHead>Duração Média</TableHead>
                    <TableHead>Taxa de Rejeição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceData.map((device) => (
                    <TableRow key={device.device}>
                      <TableCell className="font-medium capitalize">{device.device}</TableCell>
                      <TableCell>{device.sessions.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{device.avgSessionDuration}</TableCell>
                      <TableCell>{device.bounceRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
