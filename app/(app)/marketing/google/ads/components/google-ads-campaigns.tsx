"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"

interface GoogleAdsCampaignsProps {
  isConnected: boolean
}

type Campaign = {
  id: string
  name: string
  status: string
  dailyBudget: number
  spent: number
  clicks: number
  impressions: number
  ctr: number
  conversions: number
  costPerConversion: number
  roas: number
}

export function GoogleAdsCampaigns({ isConnected }: GoogleAdsCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)
    fetch("/api/google-ads/campaigns")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else setCampaigns(json.campaigns ?? [])
      })
      .catch(() => active && setError("Falha ao carregar campanhas"))
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
        <AlertDescription>Conecte-se ao Google Ads para visualizar suas campanhas.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando campanhas...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar campanhas</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas do Google Ads</CardTitle>
        <CardDescription>Desempenho das campanhas nos últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma campanha encontrada na conta.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orçamento/dia</TableHead>
                <TableHead>Gasto (30d)</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>Impressões</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversões</TableHead>
                <TableHead>ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const usage = campaign.dailyBudget > 0 ? (campaign.spent / (campaign.dailyBudget * 30)) * 100 : 0
                return (
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
                    <TableCell>{campaign.dailyBudget > 0 ? formatCurrency(campaign.dailyBudget) : "-"}</TableCell>
                    <TableCell>
                      {campaign.spent > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{formatCurrency(campaign.spent)}</span>
                            {campaign.dailyBudget > 0 && (
                              <span className="text-xs text-muted-foreground">{Math.round(usage)}%</span>
                            )}
                          </div>
                          {campaign.dailyBudget > 0 && <Progress value={Math.min(usage, 100)} />}
                        </>
                      ) : (
                        formatCurrency(0)
                      )}
                    </TableCell>
                    <TableCell>{campaign.clicks.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{campaign.impressions.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                    <TableCell>{campaign.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</TableCell>
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
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
