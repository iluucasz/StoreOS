"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Users, Globe, Clock, MousePointer } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

// Mock data
const initialPageViewsData = [
  { page: "/", views: 12, title: "Página Inicial" },
  { page: "/produtos", views: 8, title: "Produtos" },
  { page: "/sobre", views: 5, title: "Sobre Nós" },
  { page: "/contato", views: 3, title: "Contato" },
  { page: "/blog", views: 7, title: "Blog" },
  { page: "/carrinho", views: 4, title: "Carrinho" },
  { page: "/checkout", views: 2, title: "Checkout" },
  { page: "/produto/1", views: 3, title: "Produto 1" },
  { page: "/produto/2", views: 2, title: "Produto 2" },
  { page: "/blog/post-1", views: 1, title: "Post do Blog 1" },
]

const initialSourcesData = [
  { source: "Google", users: 15 },
  { source: "Direto", users: 8 },
  { source: "Facebook", users: 6 },
  { source: "Instagram", users: 4 },
  { source: "Twitter", users: 2 },
  { source: "Email", users: 3 },
  { source: "Referência", users: 5 },
]

const initialCountriesData = [
  { country: "Brasil", users: 25 },
  { country: "Estados Unidos", users: 8 },
  { country: "Portugal", users: 5 },
  { country: "Argentina", users: 3 },
  { country: "México", users: 2 },
]

interface AnalyticsRealtimeProps {
  isConnected: boolean
}

export function AnalyticsRealtime({ isConnected }: AnalyticsRealtimeProps) {
  const [activeUsers, setActiveUsers] = useState(43)
  const [pageViewsData, setPageViewsData] = useState(initialPageViewsData)
  const [sourcesData, setSourcesData] = useState(initialSourcesData)
  const [countriesData, setCountriesData] = useState(initialCountriesData)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      // Update active users
      setActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        return Math.max(30, prev + change)
      })

      // Update page views
      setPageViewsData((prev) => {
        return prev.map((item) => ({
          ...item,
          views: Math.max(1, item.views + Math.floor(Math.random() * 3) - 1),
        }))
      })

      // Update sources
      setSourcesData((prev) => {
        return prev.map((item) => ({
          ...item,
          users: Math.max(1, item.users + Math.floor(Math.random() * 3) - 1),
        }))
      })

      // Update last update time
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Conecte sua conta do Google Analytics para visualizar dados em tempo real sobre os visitantes do seu site.
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
          <Badge variant="outline" className="text-sm py-1 px-3">
            <Clock className="h-3 w-3 mr-1" />
            Atualizado: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          Atualizar Dados
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Usuários navegando agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Página</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pageViewsData.reduce((sum, item) => sum + item.views, 0)}</div>
            <p className="text-xs text-muted-foreground">Nos últimos 30 minutos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Países Ativos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{countriesData.length}</div>
            <p className="text-xs text-muted-foreground">Localizações dos usuários</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Páginas Ativas</CardTitle>
            <CardDescription>Páginas sendo visualizadas agora</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Página</TableHead>
                  <TableHead className="text-right">Visualizações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageViewsData
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 6)
                  .map((row) => (
                    <TableRow key={row.page}>
                      <TableCell>
                        <div className="font-medium">{row.title}</div>
                        <div className="text-xs text-muted-foreground">{row.page}</div>
                      </TableCell>
                      <TableCell className="text-right">{row.views}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
            <CardDescription>De onde os usuários estão vindo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourcesData.sort((a, b) => b.users - a.users)}>
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" name="Usuários" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Localização dos Usuários</CardTitle>
          <CardDescription>Países com usuários ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={countriesData.sort((a, b) => b.users - a.users)}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="country" />
                <Tooltip />
                <Bar dataKey="users" name="Usuários" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
