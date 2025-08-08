"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Check, X, AlertTriangle, LineChartIcon } from "lucide-react"

interface GoogleAnalyticsIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function GoogleAnalyticsIntegration({ isConnected, setIsConnected }: GoogleAnalyticsIntegrationProps) {
  const [trackingId, setTrackingId] = useState("")
  const [domain, setDomain] = useState("")
  const [syncSettings, setSyncSettings] = useState({
    pageViews: true,
    events: true,
    conversions: true,
    autoSync: true,
    syncInterval: 30,
  })

  const [isConnecting, setIsConnecting] = useState(false)

  // Função para conectar ao Google Analytics
  const connectToGoogleAnalytics = () => {
    setIsConnecting(true)

    // Simulação de conexão
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  // Função para desconectar do Google Analytics
  const disconnectFromGoogleAnalytics = () => {
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
          <CardTitle>Integração com Google Analytics</CardTitle>
          <CardDescription>
            Conecte sua conta do Google Analytics para sincronizar métricas e dados do seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking-id">Tracking ID</Label>
                <Input
                  id="tracking-id"
                  placeholder="UA-XXXXX-Y"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode encontrar seu Tracking ID nas configurações do Google Analytics
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domínio do Site</Label>
                <Input
                  id="domain"
                  placeholder="seusite.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Informe o domínio do seu site</p>
              </div>

              <Button
                className="w-full"
                onClick={connectToGoogleAnalytics}
                disabled={isConnecting || !trackingId || !domain}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <LineChartIcon className="mr-2 h-4 w-4" />
                    Conectar ao Google Analytics
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
                    <p className="font-medium text-green-700 dark:text-green-400">Conectado ao Google Analytics</p>
                    <p className="text-sm text-green-600/80 dark:text-green-500/80">Tracking ID: {trackingId}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectFromGoogleAnalytics}>
                  Desconectar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard title="Visualizações de Página" status="connected" description="Ativo" />
                <StatusCard title="Eventos" status="connected" description="Ativo" />
                <StatusCard title="Conversões" status="warning" description="Configuração pendente" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Configurações de Sincronização</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-pageviews">Sincronizar Visualizações de Página</Label>
                      <p className="text-xs text-muted-foreground">Importar dados de visualizações de página</p>
                    </div>
                    <Switch
                      id="sync-pageviews"
                      checked={syncSettings.pageViews}
                      onCheckedChange={(checked) => updateSyncSetting("pageViews", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-events">Sincronizar Eventos</Label>
                      <p className="text-xs text-muted-foreground">Importar dados de eventos</p>
                    </div>
                    <Switch
                      id="sync-events"
                      checked={syncSettings.events}
                      onCheckedChange={(checked) => updateSyncSetting("events", checked)}
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
