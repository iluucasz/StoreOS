"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Users, Clock, TrendingUp, ArrowUpRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data
const websiteTrafficData = [
  { date: "Jan", users: 2500, sessions: 3200, pageviews: 7800 },
  { date: "Feb", users: 3000, sessions: 3800, pageviews: 9100 },
  { date: "Mar", users: 2800, sessions: 3500, pageviews: 8500 },
  { date: "Apr", users: 3200, sessions: 4100, pageviews: 9800 },
  { date: "May", users: 3800, sessions: 4700, pageviews: 11200 },
  { date: "Jun", users: 4200, sessions: 5300, pageviews: 12500 },
  { date: "Jul", users: 4500, sessions: 5600, pageviews: 13200 },
]

const deviceData = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 36 },
  { name: "Tablet", value: 6 },
]

const channelData = [
  { name: "Organic Search", value: 42 },
  { name: "Direct", value: 28 },
  { name: "Social", value: 15 },
  { name: "Referral", value: 10 },
  { name: "Email", value: 5 },
]

interface AnalyticsDashboardProps {
  isConnected: boolean
}

export function AnalyticsDashboard({ isConnected }: AnalyticsDashboardProps) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar métricas detalhadas sobre o desempenho do seu site.
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
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,521</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,642</div>
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
            <CardTitle className="text-sm font-medium">Tempo Médio na Página</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +5.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Visão Geral do Tráfego</CardTitle>
          <CardDescription>Usuários, sessões e visualizações de página nos últimos 7 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={websiteTrafficData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#1E40AF" strokeWidth={2} />
                <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="pageviews" stroke="#93C5FD" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Distribuição de usuários por dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center">
                  <div className="w-1/3 font-medium">{device.name}</div>
                  <div className="w-2/3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${device.value}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{device.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canais de Aquisição</CardTitle>
            <CardDescription>Distribuição de usuários por canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="flex items-center">
                  <div className="w-1/3 font-medium">{channel.name}</div>
                  <div className="w-2/3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${channel.value}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{channel.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
