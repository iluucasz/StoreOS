"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, ShoppingCart, TrendingUp, Target } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useMetaData, NotConnected, LoadingState, ErrorState } from "./meta-helpers"

type ConversionsData = {
  totals: { spend: number; purchases: number; revenue: number; costPerPurchase: number; roas: number }
  events: { name: string; count: number; value: number; valuePerEvent: number }[]
}

export function FacebookPixel({ isConnected }: { isConnected: boolean }) {
  const { data, loading, error } = useMetaData<ConversionsData>("/api/meta-ads/conversions", isConnected)

  if (!isConnected) return <NotConnected what="as conversões" />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { totals, events } = data

  const cards = [
    { title: "Gasto (30d)", value: formatCurrency(totals.spend), icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    { title: "Compras", value: totals.purchases.toLocaleString("pt-BR"), icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Custo/Compra", value: formatCurrency(totals.costPerPurchase), icon: <Target className="h-4 w-4 text-muted-foreground" /> },
    { title: "ROAS", value: `${totals.roas.toFixed(2)}x`, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              {c.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos de Conversão</CardTitle>
          <CardDescription>Eventos do Pixel atribuídos aos anúncios (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {events.every((e) => e.count === 0) ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma conversão registrada — verifique se o Pixel está enviando eventos.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Valor/Evento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-right">{e.count.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{e.value > 0 ? formatCurrency(e.value) : "-"}</TableCell>
                    <TableCell className="text-right">{e.valuePerEvent > 0 ? formatCurrency(e.valuePerEvent) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
