"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Copy, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados mockados para eventos do pixel
const pixelEventsData = [
  {
    id: 1,
    event: "PageView",
    count: 12450,
    lastFired: "2 minutos atrás",
    source: "Website",
  },
  {
    id: 2,
    event: "ViewContent",
    count: 8320,
    lastFired: "5 minutos atrás",
    source: "Website",
  },
  {
    id: 3,
    event: "AddToCart",
    count: 2150,
    lastFired: "8 minutos atrás",
    source: "Website",
  },
  {
    id: 4,
    event: "InitiateCheckout",
    count: 980,
    lastFired: "15 minutos atrás",
    source: "Website",
  },
  {
    id: 5,
    event: "Purchase",
    count: 450,
    lastFired: "22 minutos atrás",
    source: "Website",
  },
]

export function FacebookPixel({ isConnected }: { isConnected: boolean }) {
  const [pixelId] = useState("123456789012345")

  if (!isConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Não conectado</AlertTitle>
        <AlertDescription>Conecte-se ao Facebook Ads para gerenciar o Pixel.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pixel do Facebook</CardTitle>
          <CardDescription>Gerencie seu Pixel do Facebook e acompanhe eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-sm font-medium">ID do Pixel:</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{pixelId}</code>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar ID do Pixel</span>
                  </Button>
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="ml-auto">
                  Ativo
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24,350</div>
                  <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.62%</div>
                  <p className="text-xs text-muted-foreground">+0.8% vs semana anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Valor de Conversões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 45,890</div>
                  <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="installation">Instalação</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>Eventos registrados pelo seu Pixel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Contagem</TableHead>
                    <TableHead>Último Disparo</TableHead>
                    <TableHead>Fonte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pixelEventsData.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.event}</TableCell>
                      <TableCell>{event.count.toLocaleString()}</TableCell>
                      <TableCell>{event.lastFired}</TableCell>
                      <TableCell>{event.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Instalação do Pixel</CardTitle>
              <CardDescription>Instruções para instalar o Pixel do Facebook no seu site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">1. Adicione o código base ao seu site</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {`<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${pixelId}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->`}
                    </pre>
                    <Button variant="outline" size="sm" className="absolute top-2 right-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">2. Adicione eventos específicos</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {`// Exemplo de evento de compra
fbq('track', 'Purchase', {
  value: 120.00,
  currency: 'BRL',
  content_ids: ['ABC123'],
  content_type: 'product'
});`}
                    </pre>
                    <Button variant="outline" size="sm" className="absolute top-2 right-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Pixel</CardTitle>
              <CardDescription>Gerencie as configurações do seu Pixel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="pixel-name" className="text-sm font-medium">
                    Nome do Pixel
                  </label>
                  <Input id="pixel-name" value="Pixel Principal" />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Domínios Verificados</label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">seusite.com.br</Badge>
                    <Badge variant="outline">loja.seusite.com.br</Badge>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Salvar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
