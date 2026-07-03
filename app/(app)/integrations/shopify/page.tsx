"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopifyDashboard } from "./components/shopify-dashboard"
import { ShopifyOrders } from "./components/shopify-orders"
import { ShopifyProducts } from "./components/shopify-products"
import { ShopifyInventory } from "./components/shopify-inventory"
import { ShopifyConfig } from "./components/shopify-config"

export type ShopifyStatus = {
  loading: boolean
  configured: boolean
  connected: boolean
  error?: string
  shop?: string
  domain?: string
  myshopify_domain?: string
  plan?: string
}

export default function ShopifyPage() {
  const [tab, setTab] = useState("dashboard")
  const [status, setStatus] = useState<ShopifyStatus>({ loading: true, configured: false, connected: false })

  const checkStatus = useCallback(async () => {
    setStatus((current) => ({ ...current, loading: true }))
    try {
      const response = await fetch("/api/shopify/test", { cache: "no-store" })
      const json = await response.json()
      setStatus({
        loading: false,
        configured: !!json.configured,
        connected: !!json.connected || !!json.ok,
        error: json.error,
        shop: json.shop,
        domain: json.domain,
        myshopify_domain: json.myshopify_domain,
        plan: json.plan,
      })
    } catch {
      setStatus({ loading: false, configured: false, connected: false, error: "Falha ao verificar conexão" })
    }
  }, [])

  useEffect(() => {
    void checkStatus()
  }, [checkStatus])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <ShoppingBag className="h-6 w-6 shrink-0 text-[#96bf48]" />
            Shopify
          </h1>
          <p className="text-muted-foreground">
            {status.shop ? `Loja: ${status.shop}` : "Sincronize loja, pedidos e estoque com a Shopify"}
          </p>
        </div>
        <div className="shrink-0">
          {status.loading ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </div>
          ) : status.connected ? (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              Conectado
            </div>
          ) : (
            <Button onClick={() => setTab("config")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Conectar Shopify
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="mb-6 overflow-x-auto">
          <TabsList className="grid w-max min-w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <ShopifyDashboard />
        </TabsContent>
        <TabsContent value="orders">
          <ShopifyOrders />
        </TabsContent>
        <TabsContent value="products">
          <ShopifyProducts />
        </TabsContent>
        <TabsContent value="inventory">
          <ShopifyInventory />
        </TabsContent>
        <TabsContent value="config">
          <ShopifyConfig status={status} onRecheck={checkStatus} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
