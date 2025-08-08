"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, RefreshCw, Check, X, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FacebookIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function FacebookIntegration({ isConnected, setIsConnected }: FacebookIntegrationProps) {
  const [accessToken, setAccessToken] = useState("")
  const [adAccountId, setAdAccountId] = useState("")
  const [pixelId, setPixelId] = useState("")
  const [syncSettings, setSyncSettings] = useState({
    campaigns: true,
    adSets: true,
    ads: true,
    metrics: true,
    audiences: true,
    autoSync: true,
    syncInterval: 30,
  })

  const [isConnecting, setIsConnecting] = useState(false)

  // Função para conectar ao Facebook
  const connectToFacebook = () => {
    setIsConnecting(true)

    // Simulação de conexão
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  // Função para desconectar do Facebook
  const disconnectFromFacebook = () => {
    setIsConnected(false)
  }

  // Função para atualizar configurações de sincronização
  const updateSyncSetting = (key: string, value: boolean | number) => {
    setSyncSettings({
      ...syncSettings,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integração com Facebook Business</CardTitle>
          <CardDescription>
            Conecte sua conta do Facebook Business para sincronizar métricas e campanhas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Insira seu token de acesso do Facebook"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode obter seu token de acesso no{" "}
                  <a
                    href="https://developers.facebook.com/tools/explorer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Graph API Explorer
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-account">ID da Conta de Anúncios</Label>
                <Input
                  id="ad-account"
                  placeholder="act_123456789"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre o ID da sua conta de anúncios no Gerenciador de Anúncios do Facebook
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixel-id">ID do Pixel</Label>
                <Input
                  id="pixel-id"
                  placeholder="123456789"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre o ID do seu pixel no Gerenciador de Eventos do Facebook
                </p>
              </div>

              <Button
                className="w-full"
                onClick={connectToFacebook}
                disabled={isConnecting || !accessToken || !adAccountId}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Facebook className="mr-2 h-4 w-4" />
                    Conectar ao Facebook
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">Conectado ao Facebook Business</p>
                    <p className="text-sm text-green-600/80 dark:text-green-500/80">
                      Conta: Business Manager (ID: 123456789)
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectFromFacebook}>
                  Desconectar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard title="Conta de Anúncios" status="connected" description="act_123456789" />
                <StatusCard title="Pixel do Facebook" status="connected" description="ID: 123456789" />
                <StatusCard title="Conversão API" status="warning" description="Configuração incompleta" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Configurações de Sincronização</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-campaigns">Sincronizar Campanhas</Label>
                      <p className="text-xs text-muted-foreground">Importar campanhas do Facebook Ads</p>
                    </div>
                    <Switch
                      id="sync-campaigns"
                      checked={syncSettings.campaigns}
                      onCheckedChange={(checked) => updateSyncSetting("campaigns", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-metrics">Sincronizar Métricas</Label>
                      <p className="text-xs text-muted-foreground">Importar métricas de desempenho</p>
                    </div>
                    <Switch
                      id="sync-metrics"
                      checked={syncSettings.metrics}
                      onCheckedChange={(checked) => updateSyncSetting("metrics", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">Sincronização Automática</Label>
                      <p className="text-xs text-muted-foreground">Atualizar dados automaticamente</p>
                    </div>
                    <Switch
                      id="auto-sync"
                      checked={syncSettings.autoSync}
                      onCheckedChange={(checked) => updateSyncSetting("autoSync", checked)}
                    />
                  </div>

                  {syncSettings.autoSync && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-interval">Intervalo de Sincronização (minutos)</Label>
                        <p className="text-xs text-muted-foreground">Frequência de atualização dos dados</p>
                      </div>
                      <Input
                        id="sync-interval"
                        type="number"
                        min="5"
                        max="1440"
                        className="w-20"
                        value={syncSettings.syncInterval}
                        onChange={(e) => updateSyncSetting("syncInterval", Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sincronizar Agora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Eventos</CardTitle>
            <CardDescription>Configure os eventos do Facebook Pixel e Conversion API</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pixel">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pixel">Pixel</TabsTrigger>
                <TabsTrigger value="conversion-api">Conversion API</TabsTrigger>
              </TabsList>
              <TabsContent value="pixel" className="mt-4 space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">PageView</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>Visualização de página</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ViewContent</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>Visualização de produto</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AddToCart</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>Adição ao carrinho</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Purchase</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>Compra finalizada</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    O Pixel do Facebook está configurado corretamente. Os eventos estão sendo rastreados em seu site.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="conversion-api" className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      Configuração da Conversion API incompleta
                    </p>
                    <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80 mt-1">
                      A Conversion API permite enviar eventos diretamente para o Facebook, melhorando a precisão do
                      rastreamento. Complete a configuração para aproveitar todos os benefícios.
                    </p>
                    <Button size="sm" className="mt-2">
                      Configurar Conversion API
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">PageView</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                          >
                            Pendente
                          </Badge>
                        </TableCell>
                        <TableCell>Visualização de página</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ViewContent</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                          >
                            Pendente
                          </Badge>
                        </TableCell>
                        <TableCell>Visualização de produto</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AddToCart</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                          >
                            Pendente
                          </Badge>
                        </TableCell>
                        <TableCell>Adição ao carrinho</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Purchase</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                          >
                            Pendente
                          </Badge>
                        </TableCell>
                        <TableCell>Compra finalizada</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface StatusCardProps {
  title: string
  status: "connected" | "warning" | "error"
  description: string
}

function StatusCard({ title, status, description }: StatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case "error":
        return <X className="h-4 w-4 text-red-600 dark:text-red-400" />
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case "connected":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getStatusClass()}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  )
}
