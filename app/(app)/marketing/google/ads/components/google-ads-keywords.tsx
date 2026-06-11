"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

interface GoogleAdsKeywordsProps {
  isConnected: boolean
}

type Keyword = {
  id: number
  keyword: string
  matchType: string
  campaign: string
  status: string
  qualityScore: number | null
  clicks: number
  impressions: number
  ctr: number
  avgCpc: number
  conversions: number
}

export function GoogleAdsKeywords({ isConnected }: GoogleAdsKeywordsProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)
    fetch("/api/google-ads/keywords")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else setKeywords(json.keywords ?? [])
      })
      .catch(() => active && setError("Falha ao carregar palavras-chave"))
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
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas palavras-chave.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando palavras-chave...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar palavras-chave</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palavras-chave do Google Ads</CardTitle>
        <CardDescription>Top 50 palavras-chave por gasto nos últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {keywords.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma palavra-chave encontrada na conta.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palavra-chave</TableHead>
                <TableHead>Correspondência</TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qualidade</TableHead>
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
                    {keyword.qualityScore != null ? (
                      <Badge
                        variant={
                          keyword.qualityScore >= 8 ? "success" : keyword.qualityScore >= 6 ? "secondary" : "destructive"
                        }
                      >
                        {keyword.qualityScore}/10
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{keyword.clicks.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{keyword.impressions.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{keyword.ctr.toFixed(2)}%</TableCell>
                  <TableCell>{formatCurrency(keyword.avgCpc)}</TableCell>
                  <TableCell>{keyword.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
