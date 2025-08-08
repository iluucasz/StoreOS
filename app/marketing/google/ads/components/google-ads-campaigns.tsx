"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GoogleAdsCampaignsProps {
  isConnected: boolean
}

export function GoogleAdsCampaigns({ isConnected }: GoogleAdsCampaignsProps) {
  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas campanhas.</AlertDescription>
      </Alert>
    )
  }

  // Dados de exemplo
  const campaigns = [
    {
      id: 1,
      name: "Campanha de Produtos Premium",
      status: "Ativa",
      budget: "R$ 500,00/dia",
      spent: 320.45,
      clicks: 1245,
      impressions: 45678,
      ctr: 2.73,
      conversions: 38,
      costPerConversion: 8.43,
      roas: 4.2,
    },
    {
      id: 2,
      name: "Remarketing - Visitantes do Site",
      status: "Ativa",
      budget: "R$ 300,00/dia",
      spent: 287.32,
      clicks: 987,
      impressions: 32456,
      ctr: 3.04,
      conversions: 42,
      costPerConversion: 6.84,
      roas: 5.1,
    },
    {
      id: 3,
      name: "Campanha de Marca",
      status: "Ativa",
      budget: "R$ 200,00/dia",
      spent: 178.65,
      clicks: 1532,
      impressions: 28976,
      ctr: 5.29,
      conversions: 67,
      costPerConversion: 2.67,
      roas: 8.3,
    },
    {
      id: 4,
      name: "Campanha de Produtos Básicos",
      status: "Pausada",
      budget: "R$ 350,00/dia",
      spent: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      conversions: 0,
      costPerConversion: 0,
      roas: 0,
    },
    {
      id: 5,
      name: "Campanha Sazonal - Verão",
      status: "Agendada",
      budget: "R$ 450,00/dia",
      spent: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      conversions: 0,
      costPerConversion: 0,
      roas: 0,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas do Google Ads</CardTitle>
        <CardDescription>Gerencie e monitore o desempenho das suas campanhas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Campanha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Gasto</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Conversões</TableHead>
              <TableHead>ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      campaign.status === "Ativa" ? "success" : campaign.status === "Pausada" ? "secondary" : "outline"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.budget}</TableCell>
                <TableCell>
                  {campaign.status === "Ativa" ? (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">R$ {campaign.spent.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(
                            (campaign.spent /
                              Number.parseFloat(campaign.budget.replace("R$ ", "").replace("/dia", ""))) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (campaign.spent / Number.parseFloat(campaign.budget.replace("R$ ", "").replace("/dia", ""))) *
                          100
                        }
                      />
                    </>
                  ) : (
                    "R$ 0,00"
                  )}
                </TableCell>
                <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                <TableCell>{campaign.conversions}</TableCell>
                <TableCell>
                  {campaign.roas > 0 ? (
                    <span className={campaign.roas >= 4 ? "text-green-600 font-medium" : ""}>
                      {campaign.roas.toFixed(1)}x
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
