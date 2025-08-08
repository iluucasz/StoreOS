"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

interface GoogleAdsIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function GoogleAdsIntegration({ isConnected, setIsConnected }: GoogleAdsIntegrationProps) {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [refreshToken, setRefreshToken] = useState("")
  const [developerToken, setDeveloperToken] = useState("")
  const [managerId, setManagerId] = useState("")

  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("daily")
  const [syncCampaigns, setSyncCampaigns] = useState(true)
  const [syncKeywords, setSyncKeywords] = useState(true)
  const [syncAds, setSyncAds] = useState(true)
  const [syncConversions, setSyncConversions] = useState(true)

  const handleConnect = () => {
    // Simulação de conexão
    if (clientId && clientSecret && developerToken) {
      setIsConnected(true)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setClientId("")
    setClientSecret("")
    setRefreshToken("")
    setDeveloperToken("")
    setManagerId("")
  }

  return (
    <Tabs defaultValue={isConnected ? "settings" : "setup"}>
      <TabsList className="mb-4">
        <TabsTrigger value="setup">Configuração</TabsTrigger>
        <TabsTrigger value="settings" disabled={!isConnected}>
          Configurações
        </TabsTrigger>
        <TabsTrigger value="advanced" disabled={!isConnected}>
          Avançado
        </TabsTrigger>
      </TabsList>

      <TabsContent value="setup">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Google Ads</CardTitle>
            <CardDescription>Configure a integração com a API do Google Ads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected ? (
              <Alert className="bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Conectado com sucesso</AlertTitle>
                <AlertDescription>Sua conta do Google Ads está conectada e sincronizando dados.</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Informações necessárias</AlertTitle>
                  <AlertDescription>
                    Para conectar ao Google Ads, você precisará criar um projeto no Google Cloud Console e configurar as
                    credenciais OAuth.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input
                    id="client-id"
                    placeholder="Seu Client ID do OAuth"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-secret">Client Secret</Label>
                  <Input
                    id="client-secret"
                    type="password"
                    placeholder="Seu Client Secret do OAuth"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developer-token">Developer Token</Label>
                  <Input
                    id="developer-token"
                    placeholder="Seu Developer Token do Google Ads"
                    value={developerToken}
                    onChange={(e) => setDeveloperToken(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager-id">ID da Conta Gerenciadora (opcional)</Label>
                  <Input
                    id="manager-id"
                    placeholder="ID da sua conta gerenciadora MCC"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isConnected ? (
              <Button variant="destructive" onClick={handleDisconnect}>
                Desconectar
              </Button>
            ) : (
              <>
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleConnect}>Conectar ao Google Ads</Button>
              </>
            )}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Sincronização</CardTitle>
            <CardDescription>Configure como os dados do Google Ads serão sincronizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Sincronização Automática</Label>
                <p className="text-sm text-muted-foreground">Sincronizar automaticamente os dados do Google Ads</p>
              </div>
              <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Frequência de Sincronização</Label>
              <select
                id="sync-frequency"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
                disabled={!autoSync}
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Dados a Sincronizar</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-campaigns"
                    checked={syncCampaigns}
                    onCheckedChange={setSyncCampaigns}
                    disabled={!autoSync}
                  />
                  <Label htmlFor="sync-campaigns">Campanhas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-keywords"
                    checked={syncKeywords}
                    onCheckedChange={setSyncKeywords}
                    disabled={!autoSync}
                  />
                  <Label htmlFor="sync-keywords">Palavras-chave</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="sync-ads" checked={syncAds} onCheckedChange={setSyncAds} disabled={!autoSync} />
                  <Label htmlFor="sync-ads">Anúncios</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-conversions"
                    checked={syncConversions}
                    onCheckedChange={setSyncConversions}
                    disabled={!autoSync}
                  />
                  <Label htmlFor="sync-conversions">Conversões</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>Configurações avançadas para a integração com o Google Ads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-version">Versão da API</Label>
              <select id="api-version" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="v13">API v13 (Recomendada)</option>
                <option value="v12">API v12</option>
                <option value="v11">API v11 (Legada)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout da API (segundos)</Label>
              <Input id="timeout" type="number" defaultValue="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retry-attempts">Tentativas de Retry</Label>
              <Input id="retry-attempts" type="number" defaultValue="3" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug-mode">Modo de Depuração</Label>
                <p className="text-sm text-muted-foreground">Ativar logs detalhados para depuração</p>
              </div>
              <Switch id="debug-mode" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cache-results">Cache de Resultados</Label>
                <p className="text-sm text-muted-foreground">Armazenar resultados em cache para melhor performance</p>
              </div>
              <Switch id="cache-results" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Configurações Avançadas</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
