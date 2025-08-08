"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, Check, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AnalyticsIntegrationProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export function AnalyticsIntegration({ isConnected, setIsConnected }: AnalyticsIntegrationProps) {
  return (
    <Tabs defaultValue="setup" className="space-y-4">
      <TabsList>
        <TabsTrigger value="setup">Configuração</TabsTrigger>
        <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
        <TabsTrigger value="events">Eventos</TabsTrigger>
        <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        <TabsTrigger value="advanced">Avançado</TabsTrigger>
      </TabsList>

      <TabsContent value="setup">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Google Analytics</CardTitle>
            <CardDescription>Configure sua integração com o Google Analytics 4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center p-2 bg-green-50 text-green-700 rounded-md">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Conectado ao Google Analytics</span>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="property-id">ID da Propriedade</Label>
                    <Input id="property-id" value="G-XXXXXXXXXX" readOnly />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="account-name">Conta</Label>
                    <Input id="account-name" value="Minha Empresa" readOnly />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="property-name">Propriedade</Label>
                    <Input id="property-name" value="Meu Site" readOnly />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => setIsConnected(false)}>
                    Desconectar
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar Dados
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="measurement-id">ID de Medição</Label>
                    <Input id="measurement-id" placeholder="G-XXXXXXXXXX" />
                    <p className="text-sm text-muted-foreground">
                      Você pode encontrar seu ID de medição nas configurações da sua propriedade do Google Analytics 4.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="api-secret">Chave API</Label>
                    <Input id="api-secret" type="password" placeholder="•••••••••••••••••" />
                    <p className="text-sm text-muted-foreground">
                      Crie uma chave API secreta nas configurações da sua propriedade do Google Analytics.
                    </p>
                  </div>
                </div>

                <Button onClick={() => setIsConnected(true)}>
                  <Activity className="mr-2 h-4 w-4" />
                  Conectar ao Google Analytics
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tracking">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Rastreamento</CardTitle>
            <CardDescription>Configure como o Google Analytics rastreia os visitantes do seu site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="track-pageviews">Rastrear Visualizações de Página</Label>
                  <p className="text-sm text-muted-foreground">
                    Rastrear automaticamente visualizações de página quando os usuários navegam pelo site
                  </p>
                </div>
                <Switch id="track-pageviews" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="track-outbound">Rastrear Links Externos</Label>
                  <p className="text-sm text-muted-foreground">
                    Rastrear cliques em links que levam para fora do seu site
                  </p>
                </div>
                <Switch id="track-outbound" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="track-scrolldepth">Rastrear Profundidade de Rolagem</Label>
                  <p className="text-sm text-muted-foreground">Rastrear até onde os usuários rolam nas páginas</p>
                </div>
                <Switch id="track-scrolldepth" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="track-files">Rastrear Downloads de Arquivos</Label>
                  <p className="text-sm text-muted-foreground">
                    Rastrear quando os usuários baixam arquivos do seu site
                  </p>
                </div>
                <Switch id="track-files" defaultChecked={true} />
              </div>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="exclude-ips">Excluir IPs</Label>
              <Textarea id="exclude-ips" placeholder="192.168.1.1, 192.168.1.2" className="min-h-[80px]" />
              <p className="text-sm text-muted-foreground">
                Lista de endereços IP que devem ser excluídos do rastreamento, separados por vírgula
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="events">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Eventos</CardTitle>
            <CardDescription>
              Configure eventos personalizados para rastrear ações específicas dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-clicks">Rastrear Cliques</Label>
                  <p className="text-sm text-muted-foreground">
                    Rastrear cliques em elementos específicos como botões e links
                  </p>
                </div>
                <Switch id="event-clicks" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-forms">Rastrear Formulários</Label>
                  <p className="text-sm text-muted-foreground">Rastrear envios, abandonos e erros em formulários</p>
                </div>
                <Switch id="event-forms" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-videos">Rastrear Vídeos</Label>
                  <p className="text-sm text-muted-foreground">Rastrear reproduções, pausas e conclusões de vídeos</p>
                </div>
                <Switch id="event-videos" defaultChecked={true} />
              </div>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="custom-events">Eventos Personalizados</Label>
              <Textarea
                id="custom-events"
                placeholder="Adicione seletores CSS para elementos que deseja rastrear"
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Adicione seletores CSS para elementos específicos que deseja rastrear, um por linha
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="ecommerce">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de E-commerce</CardTitle>
            <CardDescription>Configure o rastreamento avançado de e-commerce para sua loja online</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ecommerce-enabled">Ativar E-commerce</Label>
                  <p className="text-sm text-muted-foreground">Ativar rastreamento básico de e-commerce</p>
                </div>
                <Switch id="ecommerce-enabled" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enhanced-ecommerce">E-commerce Aprimorado</Label>
                  <p className="text-sm text-muted-foreground">
                    Rastrear visualizações de produtos, adições ao carrinho e etapas de checkout
                  </p>
                </div>
                <Switch id="enhanced-ecommerce" defaultChecked={true} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">Moeda Padrão</Label>
              <Select defaultValue="BRL">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">Libra Esterlina (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="checkout-steps">Etapas de Checkout</Label>
              <Textarea
                id="checkout-steps"
                placeholder="1. Carrinho, 2. Informações, 3. Envio, 4. Pagamento, 5. Revisão"
                className="min-h-[80px]"
                defaultValue="1. Carrinho, 2. Informações, 3. Envio, 4. Pagamento, 5. Revisão"
              />
              <p className="text-sm text-muted-foreground">
                Defina as etapas do seu processo de checkout, separadas por vírgula
              </p>
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
            <CardDescription>Configurações avançadas para usuários experientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymize-ip">Anonimizar IPs</Label>
                  <p className="text-sm text-muted-foreground">
                    Anonimizar endereços IP dos visitantes para conformidade com GDPR
                  </p>
                </div>
                <Switch id="anonymize-ip" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="force-ssl">Forçar SSL</Label>
                  <p className="text-sm text-muted-foreground">Enviar dados apenas por conexões seguras (HTTPS)</p>
                </div>
                <Switch id="force-ssl" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode">Modo de Depuração</Label>
                  <p className="text-sm text-muted-foreground">Ativar modo de depuração para solução de problemas</p>
                </div>
                <Switch id="debug-mode" defaultChecked={false} />
              </div>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="custom-dimensions">Dimensões Personalizadas</Label>
              <Textarea
                id="custom-dimensions"
                placeholder="userType: Registrado, membershipLevel: Premium"
                className="min-h-[80px]"
              />
              <p className="text-sm text-muted-foreground">
                Defina dimensões personalizadas no formato chave: valor, uma por linha
              </p>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="custom-metrics">Métricas Personalizadas</Label>
              <Textarea id="custom-metrics" placeholder="downloads: 0, shares: 0" className="min-h-[80px]" />
              <p className="text-sm text-muted-foreground">
                Defina métricas personalizadas no formato chave: valor padrão, uma por linha
              </p>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="custom-code">Código Personalizado</Label>
              <Textarea
                id="custom-code"
                placeholder="// Código JavaScript personalizado"
                className="min-h-[120px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Adicione código JavaScript personalizado para executar antes do envio de dados
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
