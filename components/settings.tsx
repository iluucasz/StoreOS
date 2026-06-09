"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "@/components/ui/use-toast"

export function Settings() {
  const { settings, updateSettings } = useSettings()

  const [form, setForm] = useState({ ...settings })

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function save() {
    updateSettings(form)
    toast({ title: "Configurações salvas", description: "Alterações aplicadas com sucesso." })
  }

  function reset() {
    const defaults = {
      shippingCost: 30, marketingBudget: 300, packagingCost: 0.6,
      paymentFeePercentage: 5, expectedMonthlySales: 50,
      storeName: "", storeCNPJ: "", storeEmail: "",
      shopifyStoreUrl: "", shopifyAccessToken: "",
      whatsappPhoneNumber: "", whatsappApiKey: "",
      lowStockThreshold: 5, maxCACAlert: 50,
    }
    setForm(defaults as typeof form)
    updateSettings(defaults)
    toast({ title: "Resetado", description: "Configurações restauradas para os padrões." })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="geral" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="w-max min-w-full grid grid-cols-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="precificacao">Precificação</TabsTrigger>
            <TabsTrigger value="integracoes">Integrações</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>
        </div>

        {/* Geral */}
        <TabsContent value="geral" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil da Loja</CardTitle>
              <CardDescription>Informações básicas do seu negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input id="storeName" placeholder="Minha Loja" value={form.storeName} onChange={(e) => set("storeName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeCNPJ">CNPJ</Label>
                <Input id="storeCNPJ" placeholder="00.000.000/0001-00" value={form.storeCNPJ} onChange={(e) => set("storeCNPJ", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">E-mail de Contato</Label>
                <Input id="storeEmail" type="email" placeholder="contato@minhaloja.com" value={form.storeEmail} onChange={(e) => set("storeEmail", e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={reset}>Resetar</Button>
              <Button onClick={save}>Salvar</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Precificação */}
        <TabsContent value="precificacao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Precificação</CardTitle>
              <CardDescription>Defaults usados no calculador de preços</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Frete de Entrada médio (R$)</Label>
                <Input id="shippingCost" type="number" min="0" value={form.shippingCost} onChange={(e) => set("shippingCost", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagingCost">Embalagem por Produto (R$)</Label>
                <Input id="packagingCost" type="number" min="0" step="0.01" value={form.packagingCost} onChange={(e) => set("packagingCost", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentFeePercentage">Taxa de Pagamento (%)</Label>
                <Input id="paymentFeePercentage" type="number" min="0" max="100" step="0.1" value={form.paymentFeePercentage} onChange={(e) => set("paymentFeePercentage", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketingBudget">Budget de Marketing Mensal (R$)</Label>
                <Input id="marketingBudget" type="number" min="0" value={form.marketingBudget} onChange={(e) => set("marketingBudget", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedMonthlySales">Vendas Mensais Esperadas</Label>
                <Input id="expectedMonthlySales" type="number" min="1" value={form.expectedMonthlySales} onChange={(e) => set("expectedMonthlySales", Number(e.target.value))} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={reset}>Resetar</Button>
              <Button onClick={save}>Salvar</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrações */}
        <TabsContent value="integracoes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tokens de Integração</CardTitle>
              <CardDescription>Credenciais para Shopify e WhatsApp Business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shopify</p>
              <div className="space-y-2">
                <Label htmlFor="shopifyStoreUrl">URL da Loja Shopify</Label>
                <Input id="shopifyStoreUrl" placeholder="minha-loja.myshopify.com" value={form.shopifyStoreUrl} onChange={(e) => set("shopifyStoreUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopifyAccessToken">Access Token</Label>
                <Input id="shopifyAccessToken" type="password" placeholder="shpat_..." value={form.shopifyAccessToken} onChange={(e) => set("shopifyAccessToken", e.target.value)} />
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">WhatsApp</p>
              <div className="space-y-2">
                <Label htmlFor="whatsappPhoneNumber">Número do WhatsApp Business</Label>
                <Input id="whatsappPhoneNumber" placeholder="+55 11 99999-0000" value={form.whatsappPhoneNumber} onChange={(e) => set("whatsappPhoneNumber", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappApiKey">API Key</Label>
                <Input id="whatsappApiKey" type="password" placeholder="EAABxxxxxx..." value={form.whatsappApiKey} onChange={(e) => set("whatsappApiKey", e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={reset}>Resetar</Button>
              <Button onClick={save}>Salvar</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alertas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Limites e Alertas</CardTitle>
              <CardDescription>Configure thresholds para notificações automáticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Alerta de Estoque Baixo (unidades)</Label>
                <Input id="lowStockThreshold" type="number" min="1" value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Alerta quando estoque for menor ou igual a esse valor</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCACAlert">Alerta de CAC Máximo (R$)</Label>
                <Input id="maxCACAlert" type="number" min="1" value={form.maxCACAlert} onChange={(e) => set("maxCACAlert", Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Alerta quando o CAC ultrapassar esse valor</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={reset}>Resetar</Button>
              <Button onClick={save}>Salvar</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
