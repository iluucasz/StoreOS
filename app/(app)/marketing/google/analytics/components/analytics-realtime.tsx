"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Globe, Clock, MousePointer, Loader2, RefreshCw } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NotConnected, LoadingState, ErrorState } from "./analytics-helpers"

interface AnalyticsRealtimeProps {
  isConnected: boolean
}

type RealtimeData = {
  activeUsers: number
  pageViews: number
  pageViewsData: { page: string; views: number }[]
  countriesData: { country: string; users: number }[]
  devicesData: { device: string; users: number }[]
}

export function AnalyticsRealtime({ isConnected }: AnalyticsRealtimeProps) {
  const [data, setData] = useState<RealtimeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const load = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true)
    try {
      const res = await fetch("/api/google-analytics/realtime", { cache: "no-store" })
      const json = await res.json()
      if (json.error) setError(json.error)
      else {
        setData(json)
        setError(null)
        setLastUpdate(new Date())
      }
    } catch {
      setError("Falha ao carregar dados em tempo real")
    } finally {
      if (showSpinner) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isConnected) return
    load(true)
    const interval = setInterval(() => load(false), 15000)
    return () => clearInterval(interval)
  }, [isConnected, load])

  if (!isConnected) return <NotConnected />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Clock className="h-3 w-3 mr-1" />
          Atualizado: {lastUpdate?.toLocaleTimeString() ?? "-"}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => load(true)} className="gap-2">
          <RefreshCw className="h-3 w-3" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Usuários navegando agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Página</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pageViews}</div>
            <p className="text-xs text-muted-foreground">Nos últimos 30 minutos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Países Ativos</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.countriesData.length}</div>
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
            {data.pageViewsData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nenhum usuário ativo no momento.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Página</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pageViewsData.slice(0, 6).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.page}</TableCell>
                      <TableCell className="text-right">{row.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Usuários ativos por dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            {data.devicesData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados no momento.</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.devicesData}>
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Usuários" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Localização dos Usuários</CardTitle>
          <CardDescription>Países com usuários ativos</CardDescription>
        </CardHeader>
        <CardContent>
          {data.countriesData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum usuário ativo no momento.</p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data.countriesData}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="country" width={120} />
                  <Tooltip />
                  <Bar dataKey="users" name="Usuários" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
