"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnalyticsEngagementProps {
  isConnected: boolean
}

export function AnalyticsEngagement({ isConnected }: AnalyticsEngagementProps) {
  // Mock data
  const engagementData = [
    { date: "01/04", pageviews: 3500, avgSessionDuration: 120, bounceRate: 45 },
    { date: "02/04", pageviews: 3700, avgSessionDuration: 125, bounceRate: 44 },
    { date: "03/04", pageviews: 3900, avgSessionDuration: 130, bounceRate: 43 },
    { date: "04/04", pageviews: 4100, avgSessionDuration: 135, bounceRate: 42 },
    { date: "05/04", pageviews: 4300, avgSessionDuration: 140, bounceRate: 41 },
    { date: "06/04", pageviews: 4500, avgSessionDuration: 145, bounceRate: 40 },
    { date: "07/04", pageviews: 4700, avgSessionDuration: 150, bounceRate: 39 },
  ]

  const pageData = [
    { page: "/home", pageviews: 12500, avgTimeOnPage: "00:02:15", bounceRate: "35%" },
    { page: "/produtos", pageviews: 8700, avgTimeOnPage: "00:03:45", bounceRate: "28%" },
    { page: "/sobre", pageviews: 4500, avgTimeOnPage: "00:01:30", bounceRate: "45%" },
    { page: "/blog", pageviews: 6800, avgTimeOnPage: "00:04:10", bounceRate: "25%" },
    { page: "/contato", pageviews: 3200, avgTimeOnPage: "00:01:45", bounceRate: "40%" },
  ]

  const deviceData = [
    { device: "Desktop", sessions: 12500, avgSessionDuration: "00:03:45", bounceRate: "35%" },
    { device: "Mobile", sessions: 18700, avgSessionDuration: "00:02:15", bounceRate: "42%" },
    { device: "Tablet", sessions: 2800, avgSessionDuration: "00:03:10", bounceRate: "38%" },
  ]

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte-se ao Google Analytics</CardTitle>
          <CardDescription>Conecte sua conta do Google Analytics para visualizar dados de engajamento</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-center text-muted-foreground mb-4">
            Você precisa conectar sua conta do Google Analytics para visualizar os dados de engajamento
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Engajamento</CardTitle>
          <CardDescription>Visualizações de página, duração da sessão e taxa de rejeição</CardDescription>
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
                    <Line
                      type="monotone"
                      dataKey="avgSessionDuration"
                      stroke="#0F9D58"
                      name="Duração Média (s)"
                      strokeWidth={2}
                    />
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
                    <Line
                      type="monotone"
                      dataKey="bounceRate"
                      stroke="#DB4437"
                      name="Taxa de Rejeição (%)"
                      strokeWidth={2}
                    />
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
          <CardDescription>Desempenho das principais páginas do site</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <TableCell>{page.pageviews.toLocaleString()}</TableCell>
                    <TableCell>{page.avgTimeOnPage}</TableCell>
                    <TableCell>{page.bounceRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engajamento por Dispositivo</CardTitle>
          <CardDescription>Comparação de métricas entre dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Desktop", value: 12500 },
                    { name: "Mobile", value: 18700 },
                    { name: "Tablet", value: 2800 },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [Number(value ?? 0).toLocaleString(), "Sessões"]} />
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
                      <TableCell className="font-medium">{device.device}</TableCell>
                      <TableCell>{device.sessions.toLocaleString()}</TableCell>
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
