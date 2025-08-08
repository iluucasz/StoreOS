"use client"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Facebook, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function FacebookIntegration({
  isConnected,
  setIsConnected,
}: {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integração com Facebook Ads</CardTitle>
          <CardDescription>Conecte sua conta do Facebook Ads para sincronizar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Status da Conexão</h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "Sua conta está conectada ao Facebook Ads"
                    : "Conecte sua conta para sincronizar dados"}
                </p>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Conectado
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                    Desconectar
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsConnected(true)}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Conectar
                </Button>
              )}
            </div>

            {isConnected && (
              <div className="pt-4 border-t">
                <h3 className="text-base font-medium mb-4">Configurações de Sincronização</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-campaigns">Sincronizar Campanhas</Label>
                      <p className="text-sm text-muted-foreground">Importar campanhas automaticamente</p>
                    </div>
                    <Switch id="sync-campaigns" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-audiences">Sincronizar Públicos</Label>
                      <p className="text-sm text-muted-foreground">Importar públicos automaticamente</p>
                    </div>
                    <Switch id="sync-audiences" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-pixel">Sincronizar Dados do Pixel</Label>
                      <p className="text-sm text-muted-foreground">Importar eventos do pixel automaticamente</p>
                    </div>
                    <Switch id="sync-pixel" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-interval">Intervalo de Sincronização</Label>
                      <p className="text-sm text-muted-foreground">Frequência de atualização dos dados</p>
                    </div>
                    <select
                      id="sync-interval"
                      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="1h">A cada hora</option>
                      <option value="6h">A cada 6 horas</option>
                      <option value="12h">A cada 12 horas</option>
                      <option value="24h" selected>
                        Diariamente
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="permissions">
          <TabsList>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissões</CardTitle>
                <CardDescription>Permissões concedidas à integração</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Leitura de campanhas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Leitura de públicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Leitura de dados do pixel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Criação de campanhas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Modificação de orçamentos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contas Conectadas</CardTitle>
                <CardDescription>Contas do Facebook Ads conectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Conta Principal</p>
                      <p className="text-sm text-muted-foreground">ID: 123456789</p>
                    </div>
                    <Badge>Ativa</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Sincronização</CardTitle>
                <CardDescription>Histórico de sincronização de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sincronização de campanhas</span>
                    <span className="text-muted-foreground">Hoje, 14:32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sincronização de públicos</span>
                    <span className="text-muted-foreground">Hoje, 14:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sincronização de dados do pixel</span>
                    <span className="text-muted-foreground">Hoje, 14:28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sincronização de campanhas</span>
                    <span className="text-muted-foreground">Ontem, 14:32</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
