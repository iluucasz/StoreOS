"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Check, Code, Settings, FileCode, BarChart, ShoppingCart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface AnalyticsIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function AnalyticsIntegration({ isConnected, setIsConnected }: AnalyticsIntegrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integração com Google Analytics</CardTitle>
          <CardDescription>Configure a integração com o Google Analytics 4</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Status da Conexão</h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "Sua conta do Google Analytics está conectada"
                    : "Conecte sua conta do Google Analytics para começar a rastrear dados"}
                </p>
              </div>
              <div>
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Conectado</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                      Desconectar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsConnected(true)}>
                    <Activity className="mr-2 h-4 w-4" />
                    Conectar ao Google Analytics
                  </Button>
                )}
              </div>
            </div>

            {isConnected && (
              <Tabs defaultValue="tracking" className="mt-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="tracking">
                    <Code className="h-4 w-4 mr-2" />
                    Rastreamento
                  </TabsTrigger>
                  <TabsTrigger value="events">
                    <BarChart className="h-4 w-4 mr-2" />
                    Eventos
                  </TabsTrigger>
                  <TabsTrigger value="ecommerce">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    E-commerce
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <Settings className="h-4 w-4 mr-2" />
                    Avançado
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tracking" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="measurement-id">ID de Medição</Label>
                    <Input id="measurement-id" value="G-XXXXXXXXXX" />
                    <p className="text-xs text-muted-foreground">Seu ID de medição do Google Analytics 4</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tracking-code">Código de Rastreamento</Label>
                    <div className="relative">
                      <Textarea
                        id="tracking-code"
                        className="font-mono text-xs h-32"
                        value={`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          navigator.clipboard.writeText(`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>`)
                        }}
                      >
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Adicione este código ao cabeçalho do seu site</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="auto-tracking" defaultChecked />
                    <Label htmlFor="auto-tracking">Rastreamento automático de páginas</Label>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="click-events" defaultChecked />
                      <Label htmlFor="click-events">Rastrear cliques em links</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="scroll-events" defaultChecked />
                      <Label htmlFor="scroll-events">Rastrear eventos de rolagem</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="form-events" defaultChecked />
                      <Label htmlFor="form-events">Rastrear envios de formulários</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="file-downloads" defaultChecked />
                      <Label htmlFor="file-downloads">Rastrear downloads de arquivos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="video-events" />
                      <Label htmlFor="video-events">Rastrear interações com vídeos</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ecommerce" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="enable-ecommerce" defaultChecked />
                      <Label htmlFor="enable-ecommerce">Ativar rastreamento de e-commerce</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="enhanced-ecommerce" defaultChecked />
                      <Label htmlFor="enhanced-ecommerce">E-commerce aprimorado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="track-cart" defaultChecked />
                      <Label htmlFor="track-cart">Rastrear adições ao carrinho</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="track-checkout" defaultChecked />
                      <Label htmlFor="track-checkout">Rastrear etapas de checkout</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="track-purchases" defaultChecked />
                      <Label htmlFor="track-purchases">Rastrear compras</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-id">Ativar User ID</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="user-id" />
                        <span className="text-sm">Rastrear usuários entre dispositivos</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="anonymize-ip">Anonimizar IPs</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="anonymize-ip" defaultChecked />
                        <span className="text-sm">Ocultar o último octeto dos endereços IP</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-dimensions">Dimensões Personalizadas</Label>
                      <Textarea
                        id="custom-dimensions"
                        placeholder="Adicione dimensões personalizadas no formato: nome:valor"
                        className="h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debug-mode">Modo de Depuração</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="debug-mode" />
                        <span className="text-sm">Ativar logs detalhados no console</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <div className="flex justify-end">
          <Button>Salvar Configurações</Button>
        </div>
      )}
    </div>
  )
}
