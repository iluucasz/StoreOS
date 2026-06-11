"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useTikTokData, NotConnected, LoadingState, ErrorState } from "./tiktok-helpers"

type Campaign = {
  id: string
  name: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  costPerConversion: number
}

export function TikTokCampaigns({ isConnected }: { isConnected: boolean }) {
  const [search, setSearch] = useState("")
  const { data, loading, error } = useTikTokData<{ campaigns: Campaign[] }>("/api/tiktok-ads/campaigns", isConnected)

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
                    <TableHead>Gasto</TableHead>
                    <TableHead>Impressões</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Custo/Conversão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{formatCurrency(c.spend)}</TableCell>
                      <TableCell>{c.impressions.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{c.clicks.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{c.ctr.toFixed(2)}%</TableCell>
                      <TableCell>{c.conversions.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{c.conversions > 0 ? formatCurrency(c.costPerConversion) : "-"}</TableCell>
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
