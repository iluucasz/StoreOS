"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Check, X, AlertTriangle, BarChart4 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GoogleAdsIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function GoogleAdsIntegration({ isConnected, setIsConnected }: GoogleAdsIntegrationProps) {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [developerToken, setDeveloperToken] = useState("")
  const [managerId, setManagerId] = useState("")
  const [syncSettings, setSyncSettings] = useState({
    campaigns: true,
    adGroups: true,
    ads: true,
    keywords: true,
    metrics: true,
    autoSync: true,
    syncInterval: 30,
  })

  const [isConnecting, setIsConnecting] = useState(false)

  // Função para conectar ao Google Ads
  const connectToGoogleAds = () => {
    setIsConnecting(true)

    // Simulação de conexão
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  // Função para desconectar do Google Ads
  const disconnectFromGoogleAds = () => {
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
          <CardTitle>Integração com Google Ads</CardTitle>
          <CardDescription>Conecte sua conta do Google Ads para sincronizar métricas e campanhas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  placeholder="Seu Client ID do Google Ads"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode obter seu Client ID no{" "}
                  <a
                    href="https://console.developers.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="Seu Client Secret do Google Ads"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="developer-token">Developer Token</Label>
                <Input
                  id="developer-token"
                  type="password"
                  placeholder="Seu Developer Token do Google Ads"
                  value={developerToken}
                  onChange={(e) => setDeveloperToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  O Developer Token é necessário para acessar a API do Google Ads
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager-id">ID da Conta MCC (opcional)</Label>
                <Input
                  id="manager-id"
                  placeholder="ID da conta gerenciadora"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Se você estiver usando uma conta MCC (My Client Center), informe o ID da conta
                </p>
              </div>

              <Button
                className="w-full"
                onClick={connectToGoogleAds}
                disabled={isConnecting || !clientId || !clientSecret || !developerToken}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Conectar ao Google Ads
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
                    <p className="font-medium text-green-700 dark:text-green-400">Conectado ao Google Ads</p>
                    <p className="text-sm text-green-600/80 dark:text-green-500/80">
                      Conta: Minha Empresa (ID: 123-456-7890)
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectFromGoogleAds}>
                  Desconectar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard title="Conta de Anúncios" status="connected" description="ID: 123-456-7890" />
                <StatusCard title="Campanhas" status="connected" description="15 campanhas sincronizadas" />
                <StatusCard title="Conversões" status="warning" description="Configuração incompleta" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Configurações de Sincronização</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-campaigns">Sincronizar Campanhas</Label>
                      <p className="text-xs text-muted-foreground">Importar campanhas do Google Ads</p>
                    </div>
                    <Switch
                      id="sync-campaigns"
                      checked={syncSettings.campaigns}
                      onCheckedChange={(checked) => updateSyncSetting("campaigns", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-adgroups">Sincronizar Grupos de Anúncios</Label>
                      <p className="text-xs text-muted-foreground">Importar grupos de anúncios</p>
                    </div>
                    <Switch
                      id="sync-adgroups"
                      checked={syncSettings.adGroups}
                      onCheckedChange={(checked) => updateSyncSetting("adGroups", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-keywords">Sincronizar Palavras-chave</Label>
                      <p className="text-xs text-muted-foreground">Importar palavras-chave e desempenho</p>
                    </div>
                    <Switch
                      id="sync-keywords"
                      checked={syncSettings.keywords}
                      onCheckedChange={(checked) => updateSyncSetting("keywords", checked)}
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
            <CardTitle>Campanhas do Google Ads</CardTitle>
            <CardDescription>Gerencie suas campanhas do Google Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="campaigns">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
                <TabsTrigger value="conversions">Conversões</TabsTrigger>
              </TabsList>
              <TabsContent value="campaigns" className="mt-4 space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orçamento</TableHead>
                        <TableHead>Cliques</TableHead>
                        <TableHead>Impressões</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead className="text-right">CPC Médio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Campanha de Pesquisa</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>R$50,00/dia</TableCell>
                        <TableCell>1.245</TableCell>
                        <TableCell>15.678</TableCell>
                        <TableCell>7,94%</TableCell>
                        <TableCell className="text-right">R$1,25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Campanha de Display</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>R$30,00/dia</TableCell>
                        <TableCell>2.567</TableCell>
                        <TableCell>78.912</TableCell>
                        <TableCell>3,25%</TableCell>
                        <TableCell className="text-right">R$0,45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Campanha de Remarketing</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>R$25,00/dia</TableCell>
                        <TableCell>987</TableCell>
                        <TableCell>12.345</TableCell>
                        <TableCell>8,00%</TableCell>
                        <TableCell className="text-right">R$0,75</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="keywords" className="mt-4 space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Palavra-chave</TableHead>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Cliques</TableHead>
                        <TableHead>Impressões</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Posição Média</TableHead>
                        <TableHead className="text-right">CPC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">marketing digital</TableCell>
                        <TableCell>Campanha de Pesquisa</TableCell>
                        <TableCell>345</TableCell>
                        <TableCell>4.567</TableCell>
                        <TableCell>7,55%</TableCell>
                        <TableCell>2,3</TableCell>
                        <TableCell className="text-right">R$1,45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">agência de marketing</TableCell>
                        <TableCell>Campanha de Pesquisa</TableCell>
                        <TableCell>289</TableCell>
                        <TableCell>3.456</TableCell>
                        <TableCell>8,36%</TableCell>
                        <TableCell>1,8</TableCell>
                        <TableCell className="text-right">R$1,78</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">consultoria marketing</TableCell>
                        <TableCell>Campanha de Pesquisa</TableCell>
                        <TableCell>178</TableCell>
                        <TableCell>2.345</TableCell>
                        <TableCell>7,59%</TableCell>
                        <TableCell>2,5</TableCell>
                        <TableCell className="text-right">R$1,32</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="conversions" className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      Configuração de conversões incompleta
                    </p>
                    <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80 mt-1">
                      Configure o rastreamento de conversões para medir o desempenho das suas campanhas com precisão.
                    </p>
                    <Button size="sm" className="mt-2">
                      Configurar Conversões
                    </Button>
                  </div>
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
