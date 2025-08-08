"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Dados mockados para campanhas
const campaignsData = [
  {
    id: 1,
    name: "Promoção de Verão",
    status: "Ativo",
    budget: "R$ 1.000,00/dia",
    spent: "R$ 789,45",
    results: 145,
    costPerResult: "R$ 5,44",
    reach: 45000,
    impressions: 85000,
    objective: "Conversões",
  },
  {
    id: 2,
    name: "Remarketing - Carrinho Abandonado",
    status: "Ativo",
    budget: "R$ 500,00/dia",
    spent: "R$ 432,18",
    results: 98,
    costPerResult: "R$ 4,41",
    reach: 28000,
    impressions: 65000,
    objective: "Conversões",
  },
  {
    id: 3,
    name: "Lançamento Produto X",
    status: "Pausado",
    budget: "R$ 1.500,00/dia",
    spent: "R$ 1.245,67",
    results: 210,
    costPerResult: "R$ 5,93",
    reach: 62000,
    impressions: 120000,
    objective: "Tráfego",
  },
  {
    id: 4,
    name: "Campanha de Marca",
    status: "Ativo",
    budget: "R$ 800,00/dia",
    spent: "R$ 645,32",
    results: 1850,
    costPerResult: "R$ 0,35",
    reach: 75000,
    impressions: 150000,
    objective: "Alcance",
  },
  {
    id: 5,
    name: "Promoção de Feriado",
    status: "Agendado",
    budget: "R$ 1.200,00/dia",
    spent: "R$ 0,00",
    results: 0,
    costPerResult: "R$ 0,00",
    reach: 0,
    impressions: 0,
    objective: "Conversões",
  },
]

export function FacebookCampaigns({ isConnected }: { isConnected: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!isConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Facebook Ads para visualizar as campanhas.</AlertDescription>
      </Alert>
    )
  }

  const filteredCampaigns = campaignsData.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campanhas</CardTitle>
          <CardDescription>Gerencie suas campanhas do Facebook Ads</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>Resultados</TableHead>
                <TableHead>Custo/Resultado</TableHead>
                <TableHead>Objetivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "Ativo"
                          ? "default"
                          : campaign.status === "Pausado"
                            ? "secondary"
                            : campaign.status === "Agendado"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.budget}</TableCell>
                  <TableCell>{campaign.spent}</TableCell>
                  <TableCell>{campaign.results}</TableCell>
                  <TableCell>{campaign.costPerResult}</TableCell>
                  <TableCell>{campaign.objective}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
