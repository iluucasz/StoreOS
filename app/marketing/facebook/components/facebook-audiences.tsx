"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Dados mockados para públicos
const audiencesData = [
  {
    id: 1,
    name: "Visitantes do Site (30 dias)",
    type: "Personalizado",
    source: "Pixel",
    size: 45000,
    status: "Pronto",
    lastUpdated: "Hoje",
  },
  {
    id: 2,
    name: "Compradores (90 dias)",
    type: "Personalizado",
    source: "Pixel",
    size: 12500,
    status: "Pronto",
    lastUpdated: "Ontem",
  },
  {
    id: 3,
    name: "Público Semelhante - Compradores",
    type: "Semelhante",
    source: "Compradores (90 dias)",
    size: 850000,
    status: "Pronto",
    lastUpdated: "3 dias atrás",
  },
  {
    id: 4,
    name: "Engajamento com Página",
    type: "Personalizado",
    source: "Facebook",
    size: 28000,
    status: "Pronto",
    lastUpdated: "5 dias atrás",
  },
  {
    id: 5,
    name: "Lista de Emails - Newsletter",
    type: "Personalizado",
    source: "Lista de Clientes",
    size: 8500,
    status: "Em processamento",
    lastUpdated: "Hoje",
  },
]

export function FacebookAudiences({ isConnected }: { isConnected: boolean }) {
  if (!isConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Facebook Ads para visualizar os públicos.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar públicos..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Público
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Públicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+1 nos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alcance Potencial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">944.000</div>
            <p className="text-xs text-muted-foreground">Pessoas únicas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Públicos Personalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">80% do total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Públicos Semelhantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">20% do total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Públicos</CardTitle>
          <CardDescription>Gerencie seus públicos do Facebook Ads</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audiencesData.map((audience) => (
                <TableRow key={audience.id}>
                  <TableCell className="font-medium">{audience.name}</TableCell>
                  <TableCell>{audience.type}</TableCell>
                  <TableCell>{audience.source}</TableCell>
                  <TableCell>{audience.size.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={audience.status === "Pronto" ? "default" : "secondary"}>{audience.status}</Badge>
                  </TableCell>
                  <TableCell>{audience.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
