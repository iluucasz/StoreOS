"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAnalyticsData, NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsAcquisitionProps {
  isConnected: boolean
}

type AcquisitionData = {
  sourceData: { name: string; value: number; color: string }[]
  campaignData: { name: string; users: number; sessions: number; conversions: number }[]
  referralData: { source: string; users: number; sessions: number; convRate: string }[]
}

export function AnalyticsAcquisition({ isConnected }: AnalyticsAcquisitionProps) {
  const { data, loading, error } = useAnalyticsData<AcquisitionData>("/api/google-analytics/acquisition", isConnected)

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { sourceData, campaignData, referralData } = data

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>Distribuição de usuários por canal de aquisição (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {sourceData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Sem dados de tráfego no período.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentual"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campanhas UTM</CardTitle>
          <CardDescription>Desempenho das campanhas com parâmetros UTM</CardDescription>
        </CardHeader>
        <CardContent>
          {campaignData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma campanha UTM no período.</p>
          ) : (
            <Tabs defaultValue="chart">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Gráfico</TabsTrigger>
                <TabsTrigger value="table">Tabela</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="mt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#4285F4" name="Usuários" />
                      <Bar dataKey="sessions" fill="#F4B400" name="Sessões" />
                      <Bar dataKey="conversions" fill="#0F9D58" name="Conversões" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="table" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Usuários</TableHead>
                        <TableHead>Sessões</TableHead>
                        <TableHead>Conversões</TableHead>
                        <TableHead>Taxa de Conversão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignData.map((campaign) => (
                        <TableRow key={campaign.name}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{campaign.users.toLocaleString("pt-BR")}</TableCell>
                          <TableCell>{campaign.sessions.toLocaleString("pt-BR")}</TableCell>
                          <TableCell>{campaign.conversions.toLocaleString("pt-BR")}</TableCell>
                          <TableCell>{campaign.users ? ((campaign.conversions / campaign.users) * 100).toFixed(2) : "0.00"}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sites de Referência</CardTitle>
          <CardDescription>Principais sites que direcionam tráfego para você</CardDescription>
        </CardHeader>
        <CardContent>
          {referralData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum site de referência no período.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Sessões</TableHead>
                    <TableHead>Taxa de Conversão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData.map((referral) => (
                    <TableRow key={referral.source}>
                      <TableCell className="font-medium">{referral.source}</TableCell>
                      <TableCell>{referral.users.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{referral.sessions.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{referral.convRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
