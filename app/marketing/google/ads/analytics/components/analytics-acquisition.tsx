"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const acquisitionData = [
  { source: "Google", users: 2500, newUsers: 1800, sessions: 3200, bounceRate: 42, pagesPerSession: 3.2 },
  { source: "Direct", users: 1800, newUsers: 1200, sessions: 2100, bounceRate: 38, pagesPerSession: 3.8 },
  { source: "Facebook", users: 1200, newUsers: 900, sessions: 1500, bounceRate: 45, pagesPerSession: 2.9 },
  { source: "Twitter", users: 800, newUsers: 600, sessions: 950, bounceRate: 48, pagesPerSession: 2.7 },
  { source: "Instagram", users: 750, newUsers: 550, sessions: 900, bounceRate: 40, pagesPerSession: 3.1 },
  { source: "LinkedIn", users: 500, newUsers: 350, sessions: 600, bounceRate: 36, pagesPerSession: 3.5 },
  { source: "Referral", users: 450, newUsers: 300, sessions: 550, bounceRate: 39, pagesPerSession: 3.3 },
  { source: "Email", users: 400, newUsers: 250, sessions: 480, bounceRate: 35, pagesPerSession: 3.6 },
]

const channelPerformanceData = [
  { name: "Organic", users: 2500, newUsers: 1800 },
  { name: "Direct", users: 1800, newUsers: 1200 },
  { name: "Social", users: 2750, newUsers: 2050 },
  { name: "Referral", users: 450, newUsers: 300 },
  { name: "Email", users: 400, newUsers: 250 },
  { name: "Paid Search", users: 1200, newUsers: 900 },
  { name: "Display", users: 350, newUsers: 250 },
]

interface AnalyticsAcquisitionProps {
  isConnected: boolean
}

export function AnalyticsAcquisition({ isConnected }: AnalyticsAcquisitionProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre a aquisição de usuários.
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
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Canal</CardTitle>
          <CardDescription>Usuários e novos usuários por canal de aquisição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" name="Usuários" fill="#3B82F6" />
                <Bar dataKey="newUsers" name="Novos Usuários" fill="#93C5FD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>Detalhes de aquisição por fonte</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonte</TableHead>
                <TableHead className="text-right">Usuários</TableHead>
                <TableHead className="text-right">Novos Usuários</TableHead>
                <TableHead className="text-right">Sessões</TableHead>
                <TableHead className="text-right">Taxa de Rejeição</TableHead>
                <TableHead className="text-right">Páginas/Sessão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acquisitionData.map((row) => (
                <TableRow key={row.source}>
                  <TableCell className="font-medium">{row.source}</TableCell>
                  <TableCell className="text-right">{row.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.newUsers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.sessions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.bounceRate}%</TableCell>
                  <TableCell className="text-right">{row.pagesPerSession}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
