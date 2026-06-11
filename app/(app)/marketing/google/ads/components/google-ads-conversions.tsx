"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

interface GoogleAdsConversionsProps {
  isConnected: boolean
}

type ConversionOverview = {
  name: string
  category: string
  count: number
  value: number
  valuePerConversion: number
}

type ConversionAction = {
  id: number
  name: string
  category: string
  status: string
  trackingType: string
  conversionValue: string
  countingMethod: string
  attributionModel: string
}

export function GoogleAdsConversions({ isConnected }: GoogleAdsConversionsProps) {
  const [conversions, setConversions] = useState<ConversionOverview[]>([])
  const [actions, setActions] = useState<ConversionAction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)
    fetch("/api/google-ads/conversions")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else {
          setConversions(json.conversions ?? [])
          setActions(json.actions ?? [])
        }
      })
      .catch(() => active && setError("Falha ao carregar conversões"))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas conversões.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando conversões...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar conversões</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="actions">Ações de Conversão</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Conversões do Google Ads</CardTitle>
            <CardDescription>Desempenho por ação de conversão nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {conversions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma conversão registrada no período.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Conversão</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Valor/Conversão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((conversion, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{conversion.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            conversion.category === "Transação"
                              ? "default"
                              : conversion.category === "Lead"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {conversion.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{conversion.count.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</TableCell>
                      <TableCell>{formatCurrency(conversion.value)}</TableCell>
                      <TableCell>{formatCurrency(conversion.valuePerConversion)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="actions">
        <Card>
          <CardHeader>
            <CardTitle>Ações de Conversão</CardTitle>
            <CardDescription>Ações de conversão configuradas na conta</CardDescription>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma ação de conversão configurada.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Ação</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Contagem</TableHead>
                    <TableHead>Atribuição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium">{action.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            action.category === "Transação"
                              ? "default"
                              : action.category === "Lead"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {action.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={action.status === "Ativa" ? "success" : "secondary"}>{action.status}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{action.trackingType.toLowerCase()}</TableCell>
                      <TableCell>{action.conversionValue}</TableCell>
                      <TableCell>{action.countingMethod}</TableCell>
                      <TableCell>{action.attributionModel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
