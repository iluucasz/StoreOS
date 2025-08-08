"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnalyticsAcquisitionProps {
  isConnected: boolean
}

export function AnalyticsAcquisition({ isConnected }: AnalyticsAcquisitionProps) {
  // Mock data
  const sourceData = [
    { name: "Orgânico", value: 35, color: "#4285F4" },
    { name: "Direto", value: 25, color: "#DB4437" },
    { name: "Referência", value: 15, color: "#F4B400" },
    { name: "Social", value: 15, color: "#0F9D58" },
    { name: "Email", value: 10, color: "#8b5cf6" },
  ]

  const campaignData = [
    { name: "promo_verao", users: 1200, sessions: 1500, conversions: 45 },
    { name: "black_friday", users: 2500, sessions: 3200, conversions: 120 },
    { name: "lancamento", users: 1800, sessions: 2300, conversions: 85 },
    { name: "remarketing", users: 950, sessions: 1100, conversions: 35 },
    { name: "newsletter", users: 750, sessions: 850, conversions: 25 },
  ]

  const referralData = [
    { source: "facebook.com", users: 2500, sessions: 3200, convRate: "4.8%" },
    { source: "instagram.com", users: 1800, sessions: 2300, convRate: "3.9%" },
    { source: "linkedin.com", users: 950, sessions: 1100, convRate: "3.2%" },
    { source: "parceiro1.com.br", users: 750, sessions: 850, convRate: "5.1%" },
    { source: "parceiro2.com.br", users: 650, sessions: 720, convRate: "4.5%" },
  ]

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte-se ao Google Analytics</CardTitle>
          <CardDescription>Conecte sua conta do Google Analytics para visualizar dados de aquisição</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-center text-muted-foreground mb-4">
            Você precisa conectar sua conta do Google Analytics para visualizar os dados de aquisição
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>Distribuição de usuários por canal de aquisição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentual"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Principais Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4285F4] mt-1.5"></div>
                  <p className="text-sm">
                    <strong>Tráfego Orgânico (35%):</strong> Principal fonte de aquisição, indicando bom SEO.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#DB4437] mt-1.5"></div>
                  <p className="text-sm">
                    <strong>Tráfego Direto (25%):</strong> Indica forte reconhecimento de marca.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F4B400] mt-1.5"></div>
                  <p className="text-sm">
                    <strong>Referência (15%):</strong> Bom desempenho de parcerias e backlinks.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0F9D58] mt-1.5"></div>
                  <p className="text-sm">
                    <strong>Social (15%):</strong> Engajamento consistente nas redes sociais.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8b5cf6] mt-1.5"></div>
                  <p className="text-sm">
                    <strong>Email (10%):</strong> Oportunidade para melhorar campanhas de email marketing.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campanhas UTM</CardTitle>
          <CardDescription>Desempenho das campanhas com parâmetros UTM</CardDescription>
        </CardHeader>
        <CardContent>
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
                        <TableCell>{campaign.users.toLocaleString()}</TableCell>
                        <TableCell>{campaign.sessions.toLocaleString()}</TableCell>
                        <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                        <TableCell>{((campaign.conversions / campaign.users) * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sites de Referência</CardTitle>
          <CardDescription>Principais sites que direcionam tráfego para você</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <TableCell>{referral.users.toLocaleString()}</TableCell>
                    <TableCell>{referral.sessions.toLocaleString()}</TableCell>
                    <TableCell>{referral.convRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
