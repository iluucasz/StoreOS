"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GoogleAdsConversionsProps {
  isConnected: boolean
}

export function GoogleAdsConversions({ isConnected }: GoogleAdsConversionsProps) {
  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas conversões.</AlertDescription>
      </Alert>
    )
  }

  // Dados de exemplo
  const conversions = [
    {
      id: 1,
      name: "Compra Concluída",
      source: "Website",
      category: "Transação",
      status: "Ativa",
      count: 87,
      value: 8745.32,
      costPerConversion: 12.45,
    },
    {
      id: 2,
      name: "Cadastro de Lead",
      source: "Website",
      category: "Lead",
      status: "Ativa",
      count: 156,
      value: 3120.0,
      costPerConversion: 5.67,
    },
    {
      id: 3,
      name: "Download de Catálogo",
      source: "Website",
      category: "Engajamento",
      status: "Ativa",
      count: 234,
      value: 1170.0,
      costPerConversion: 3.21,
    },
    {
      id: 4,
      name: "Inscrição Newsletter",
      source: "Website",
      category: "Lead",
      status: "Ativa",
      count: 312,
      value: 1560.0,
      costPerConversion: 2.45,
    },
    {
      id: 5,
      name: "Visualização de Vídeo",
      source: "YouTube",
      category: "Engajamento",
      status: "Ativa",
      count: 1245,
      value: 1245.0,
      costPerConversion: 0.87,
    },
  ]

  const conversionActions = [
    {
      id: 1,
      name: "Compra Concluída",
      category: "Transação",
      status: "Ativa",
      trackingType: "Página de agradecimento",
      conversionValue: "Dinâmico",
      countingMethod: "Uma por clique",
      attributionModel: "Último clique",
    },
    {
      id: 2,
      name: "Cadastro de Lead",
      category: "Lead",
      status: "Ativa",
      trackingType: "Código de conversão",
      conversionValue: "R$ 20,00",
      countingMethod: "Uma por clique",
      attributionModel: "Último clique",
    },
    {
      id: 3,
      name: "Download de Catálogo",
      category: "Engajamento",
      status: "Ativa",
      trackingType: "Código de conversão",
      conversionValue: "R$ 5,00",
      countingMethod: "Todas",
      attributionModel: "Baseado em dados",
    },
    {
      id: 4,
      name: "Inscrição Newsletter",
      category: "Lead",
      status: "Ativa",
      trackingType: "Código de conversão",
      conversionValue: "R$ 5,00",
      countingMethod: "Todas",
      attributionModel: "Baseado em dados",
    },
    {
      id: 5,
      name: "Visualização de Vídeo",
      category: "Engajamento",
      status: "Ativa",
      trackingType: "Evento do YouTube",
      conversionValue: "R$ 1,00",
      countingMethod: "Todas",
      attributionModel: "Baseado em dados",
    },
  ]

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
            <CardDescription>Monitore o desempenho das suas conversões</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Conversão</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conversões</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Custo/Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell className="font-medium">{conversion.name}</TableCell>
                    <TableCell>{conversion.source}</TableCell>
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
                    <TableCell>
                      <Badge variant={conversion.status === "Ativa" ? "success" : "secondary"}>
                        {conversion.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{conversion.count}</TableCell>
                    <TableCell>R$ {conversion.value.toFixed(2)}</TableCell>
                    <TableCell>R$ {conversion.costPerConversion.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="actions">
        <Card>
          <CardHeader>
            <CardTitle>Ações de Conversão</CardTitle>
            <CardDescription>Gerencie suas ações de conversão configuradas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Ação</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo de Rastreamento</TableHead>
                  <TableHead>Valor da Conversão</TableHead>
                  <TableHead>Método de Contagem</TableHead>
                  <TableHead>Modelo de Atribuição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversionActions.map((action) => (
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
                    <TableCell>{action.trackingType}</TableCell>
                    <TableCell>{action.conversionValue}</TableCell>
                    <TableCell>{action.countingMethod}</TableCell>
                    <TableCell>{action.attributionModel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
