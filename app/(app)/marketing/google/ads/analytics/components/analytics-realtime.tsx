"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Users, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

// Mock data
const initialActiveUsersData = [
  { time: "00:00", users: 42 },
  { time: "00:01", users: 45 },
  { time: "00:02", users: 48 },
  { time: "00:03", users: 46 },
  { time: "00:04", users: 50 },
  { time: "00:05", users: 52 },
  { time: "00:06", users: 55 },
  { time: "00:07", users: 58 },
  { time: "00:08", users: 56 },
  { time: "00:09", users: 60 },
  { time: "00:10", users: 62 },
  { time: "00:11", users: 65 },
  { time: "00:12", users: 68 },
  { time: "00:13", users: 70 },
  { time: "00:14", users: 72 },
  { time: "00:15", users: 75 },
  { time: "00:16", users: 78 },
  { time: "00:17", users: 80 },
  { time: "00:18", users: 82 },
  { time: "00:19", users: 85 },
]

const activePageData = [
  { page: "/home", activeUsers: 32, avgEngagementTime: "1:45" },
  { page: "/products", activeUsers: 28, avgEngagementTime: "2:20" },
  { page: "/blog", activeUsers: 15, avgEngagementTime: "3:10" },
  { page: "/about", activeUsers: 8, avgEngagementTime: "1:05" },
  { page: "/contact", activeUsers: 6, avgEngagementTime: "0:45" },
  { page: "/pricing", activeUsers: 12, avgEngagementTime: "2:30" },
  { page: "/features", activeUsers: 10, avgEngagementTime: "1:55" },
]

const trafficSourceData = [
  { source: "Direct", activeUsers: 35 },
  { source: "Organic Search", activeUsers: 28 },
  { source: "Social", activeUsers: 18 },
  { source: "Referral", activeUsers: 12 },
  { source: "Email", activeUsers: 7 },
]

const locationData = [
  { country: "Brasil", activeUsers: 45 },
  { country: "Estados Unidos", activeUsers: 25 },
  { country: "Portugal", activeUsers: 12 },
  { country: "Espanha", activeUsers: 8 },
  { country: "Argentina", activeUsers: 6 },
  { country: "México", activeUsers: 4 },
]

interface AnalyticsRealtimeProps {
  isConnected: boolean
}

export function AnalyticsRealtime({ isConnected }: AnalyticsRealtimeProps) {
  const [activeUsersData, setActiveUsersData] = useState(initialActiveUsersData)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeUsers, setActiveUsers] = useState(85)

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        const newUsers = activeUsers + Math.floor(Math.random() * 10) - 4
        setActiveUsers(newUsers > 0 ? newUsers : 1)

        const now = new Date()
        const timeString =
          now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0") +
          ":" +
          now.getSeconds().toString().padStart(2, "0")

        setActiveUsersData((prev) => {
          const newData = [...prev.slice(1), { time: timeString, users: newUsers }]
          return newData
        })

        setLastUpdated(now)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isConnected, activeUsers])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas em tempo real do seu site.
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Dados em tempo real</h3>
          <span className="text-sm text-muted-foreground">Última atualização: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Agora mesmo no seu site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas / Usuário</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8</div>
            <p className="text-xs text-muted-foreground">Média nos últimos 30 minutos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1m 45s</div>
            <p className="text-xs text-muted-foreground">Tempo médio na sessão atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Percentual de novos usuários</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Ativos</CardTitle>
          <CardDescription>Usuários ativos nos últimos 20 minutos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeUsersData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" name="Usuários Ativos" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Páginas Ativas</CardTitle>
            <CardDescription>Páginas com usuários ativos no momento</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Página</TableHead>
                  <TableHead className="text-right">Usuários Ativos</TableHead>
                  <TableHead className="text-right">Tempo Médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activePageData.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell className="font-medium">{row.page}</TableCell>
                    <TableCell className="text-right">{row.activeUsers}</TableCell>
                    <TableCell className="text-right">{row.avgEngagementTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fontes de Tráfego</CardTitle>
              <CardDescription>Usuários ativos por fonte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficSourceData}>
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" name="Usuários Ativos" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
              <CardDescription>Usuários ativos por país</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>País</TableHead>
                    <TableHead className="text-right">Usuários Ativos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationData.map((row) => (
                    <TableRow key={row.country}>
                      <TableCell className="font-medium">{row.country}</TableCell>
                      <TableCell className="text-right">{row.activeUsers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
