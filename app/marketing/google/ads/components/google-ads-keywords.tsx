"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GoogleAdsKeywordsProps {
  isConnected: boolean
}

export function GoogleAdsKeywords({ isConnected }: GoogleAdsKeywordsProps) {
  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas palavras-chave.</AlertDescription>
      </Alert>
    )
  }

  // Dados de exemplo
  const keywords = [
    {
      id: 1,
      keyword: "produtos premium",
      matchType: "Ampla",
      campaign: "Campanha de Produtos Premium",
      status: "Ativa",
      qualityScore: 8,
      clicks: 345,
      impressions: 5678,
      ctr: 6.08,
      avgCpc: 1.23,
      cost: 424.35,
      conversions: 12,
      conversionRate: 3.48,
    },
    {
      id: 2,
      keyword: "produtos premium comprar",
      matchType: "Frase",
      campaign: "Campanha de Produtos Premium",
      status: "Ativa",
      qualityScore: 9,
      clicks: 287,
      impressions: 3245,
      ctr: 8.84,
      avgCpc: 1.05,
      cost: 301.35,
      conversions: 15,
      conversionRate: 5.23,
    },
    {
      id: 3,
      keyword: "[produtos premium online]",
      matchType: "Exata",
      campaign: "Campanha de Produtos Premium",
      status: "Ativa",
      qualityScore: 10,
      clicks: 198,
      impressions: 1876,
      ctr: 10.55,
      avgCpc: 0.95,
      cost: 188.1,
      conversions: 11,
      conversionRate: 5.56,
    },
    {
      id: 4,
      keyword: "-produtos básicos",
      matchType: "Negativa",
      campaign: "Campanha de Produtos Premium",
      status: "Ativa",
      qualityScore: "-",
      clicks: "-",
      impressions: "-",
      ctr: "-",
      avgCpc: "-",
      cost: "-",
      conversions: "-",
      conversionRate: "-",
    },
    {
      id: 5,
      keyword: "remarketing produtos",
      matchType: "Ampla",
      campaign: "Remarketing - Visitantes do Site",
      status: "Ativa",
      qualityScore: 7,
      clicks: 156,
      impressions: 2345,
      ctr: 6.65,
      avgCpc: 1.15,
      cost: 179.4,
      conversions: 8,
      conversionRate: 5.13,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palavras-chave do Google Ads</CardTitle>
        <CardDescription>Gerencie e monitore o desempenho das suas palavras-chave</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Palavra-chave</TableHead>
              <TableHead>Tipo de Correspondência</TableHead>
              <TableHead>Campanha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Índice de Qualidade</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Impressões</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>CPC Médio</TableHead>
              <TableHead>Conversões</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      keyword.matchType === "Exata"
                        ? "default"
                        : keyword.matchType === "Frase"
                          ? "secondary"
                          : keyword.matchType === "Negativa"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {keyword.matchType}
                  </Badge>
                </TableCell>
                <TableCell>{keyword.campaign}</TableCell>
                <TableCell>
                  <Badge variant={keyword.status === "Ativa" ? "success" : "secondary"}>{keyword.status}</Badge>
                </TableCell>
                <TableCell>
                  {keyword.qualityScore !== "-" ? (
                    <Badge
                      variant={
                        Number(keyword.qualityScore) >= 8
                          ? "success"
                          : Number(keyword.qualityScore) >= 6
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {keyword.qualityScore}/10
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{keyword.clicks !== "-" ? keyword.clicks.toLocaleString() : "-"}</TableCell>
                <TableCell>{keyword.impressions !== "-" ? keyword.impressions.toLocaleString() : "-"}</TableCell>
                <TableCell>{keyword.ctr !== "-" ? `${keyword.ctr}%` : "-"}</TableCell>
                <TableCell>{keyword.avgCpc !== "-" ? `R$ ${keyword.avgCpc}` : "-"}</TableCell>
                <TableCell>{keyword.conversions !== "-" ? keyword.conversions : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
