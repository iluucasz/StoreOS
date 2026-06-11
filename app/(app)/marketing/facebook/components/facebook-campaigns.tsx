"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useMetaData, NotConnected, LoadingState, ErrorState } from "./meta-helpers"

type Campaign = {
  id: string
  name: string
  status: string
  objective: string
  dailyBudget: number
  spend: number
  impressions: number
  reach: number
  clicks: number
  ctr: number
  purchases: number
  costPerResult: number
  roas: number
}

export function FacebookCampaigns({ isConnected }: { isConnected: boolean }) {
  const [search, setSearch] = useState("")
  const { data, loading, error } = useMetaData<{ campaigns: Campaign[] }>("/api/meta-ads/campaigns", isConnected)

  if (!isConnected) return <NotConnected what="as campanhas" />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  const campaigns = (data?.campaigns ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar campanhas..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campanhas</CardTitle>
          <CardDescription>Desempenho das campanhas nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma campanha encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orçamento/dia</TableHead>
                    <TableHead>Gasto</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Custo/Compra</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Objetivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={c.status === "Ativo" ? "default" : c.status === "Pausado" ? "secondary" : "outline"}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{c.dailyBudget > 0 ? formatCurrency(c.dailyBudget) : "-"}</TableCell>
                      <TableCell>{formatCurrency(c.spend)}</TableCell>
                      <TableCell>{c.purchases.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{c.purchases > 0 ? formatCurrency(c.costPerResult) : "-"}</TableCell>
                      <TableCell>
                        {c.roas > 0 ? (
                          <span className={c.roas >= 3 ? "font-medium text-green-600" : ""}>{c.roas.toFixed(2)}x</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.objective}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
