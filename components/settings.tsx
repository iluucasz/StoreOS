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

  const [formData, setFormData] = useState({
    shippingCost: settings.shippingCost,
    marketingBudget: settings.marketingBudget,
    packagingCost: settings.packagingCost,
    paymentFeePercentage: settings.paymentFeePercentage,
    expectedMonthlySales: settings.expectedMonthlySales,
  })

  const handleChange = (field: string, value: number) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSaveSettings = () => {
    updateSettings(formData)
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    })
  }

  const handleResetSettings = () => {
    const defaultSettings = {
      shippingCost: 30,
      marketingBudget: 300,
      packagingCost: 0.6,
      paymentFeePercentage: 5,
      expectedMonthlySales: 50,
    }

    setFormData(defaultSettings)
    updateSettings(defaultSettings)

    toast({
      title: "Configurações resetadas",
      description: "Suas configurações foram restauradas para os valores padrão.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="costs" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="costs">Custos</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Custos</CardTitle>
              <CardDescription>Configure os parâmetros de custo para cálculos de precificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping-cost">Custo de Frete (R$)</Label>
                <Input
                  id="shipping-cost"
                  type="number"
                  min="0"
                  value={formData.shippingCost}
                  onChange={(e) => handleChange("shippingCost", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Custo médio de frete por lote de produtos</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketing-budget">Orçamento de Marketing Mensal (R$)</Label>
                <Input
                  id="marketing-budget"
                  type="number"
                  min="0"
                  value={formData.marketingBudget}
                  onChange={(e) => handleChange("marketingBudget", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Valor mensal investido em marketing (Meta Ads, etc.)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packaging-cost">Custo de Embalagem por Produto (R$)</Label>
                <Input
                  id="packaging-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.packagingCost}
                  onChange={(e) => handleChange("packagingCost", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Custo médio de embalagem por produto</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-fee">Taxa de Pagamento (%)</Label>
                <Input
                  id="payment-fee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.paymentFeePercentage}
                  onChange={(e) => handleChange("paymentFeePercentage", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Percentual cobrado pelo processador de pagamento</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-sales">Vendas Mensais Esperadas</Label>
                <Input
                  id="expected-sales"
                  type="number"
                  min="1"
                  value={formData.expectedMonthlySales}
                  onChange={(e) => handleChange("expectedMonthlySales", Number.parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Quantidade estimada de vendas mensais</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetSettings}>
                Resetar
              </Button>
              <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>Gerencie suas informações de conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="Usuário" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="usuario@exemplo.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>Gerencie suas configurações de privacidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suas informações são armazenadas localmente e não são compartilhadas com terceiros.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie suas configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta aplicação funciona localmente no seu navegador. Nenhuma informação é enviada para servidores
                externos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
