"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useMetaData, NotConnected, LoadingState, ErrorState } from "./meta-helpers"

const GENDER_COLORS = ["#0866FF", "#E4405F", "#9ca3af"]

type DemographicsData = {
  byAge: { name: string; spend: number }[]
  byGender: { name: string; spend: number }[]
  rows: { age: string; gender: string; spend: number; impressions: number; clicks: number; purchases: number }[]
}

export function FacebookAudiences({ isConnected }: { isConnected: boolean }) {
  const { data, loading, error } = useMetaData<DemographicsData>("/api/meta-ads/demographics", isConnected)

  if (!isConnected) return <NotConnected what="a demografia" />
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const { byAge, byGender, rows } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gasto por Faixa Etária</CardTitle>
            <CardDescription>Distribuição do investimento por idade (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {byAge.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Sem dados no período.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byAge}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `R$${v}`} />
                    <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Gasto"]} />
                    <Bar dataKey="spend" fill="#0866FF" name="Gasto" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gasto por Gênero</CardTitle>
            <CardDescription>Distribuição do investimento por gênero (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {byGender.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Sem dados no período.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byGender}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="spend"
                      nameKey="name"
                      label={({ name }) => name}
                    >
                      {byGender.map((_, i) => (
                        <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Gasto"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhe por Idade e Gênero</CardTitle>
          <CardDescription>Desempenho segmentado (30 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Sem dados no período.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faixa Etária</TableHead>
                    <TableHead>Gênero</TableHead>
                    <TableHead>Gasto</TableHead>
                    <TableHead>Impressões</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>Compras</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.age}</TableCell>
                      <TableCell>{r.gender}</TableCell>
                      <TableCell>{formatCurrency(r.spend)}</TableCell>
                      <TableCell>{r.impressions.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{r.clicks.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{r.purchases.toLocaleString("pt-BR")}</TableCell>
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
