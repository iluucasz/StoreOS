"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check } from "lucide-react"
import { ShopifyDashboard } from "./components/shopify-dashboard"
import { ShopifyOrders } from "./components/shopify-orders"
import { ShopifyProducts } from "./components/shopify-products"
import { ShopifyInventory } from "./components/shopify-inventory"
import { ShopifyConfig } from "./components/shopify-config"

export default function ShopifyPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#96bf48] shrink-0" />
            Shopify
          </h1>
          <p className="text-muted-foreground">Sincronize sua loja, pedidos e estoque com o Shopify</p>
        </div>
        <div className="shrink-0">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Check className="h-4 w-4" />
                Conectado
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                Desconectar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsConnected(true)}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Conectar ao Shopify
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <div className="overflow-x-auto mb-6">
          <TabsList className="w-max min-w-full grid grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard"><ShopifyDashboard /></TabsContent>
        <TabsContent value="orders"><ShopifyOrders /></TabsContent>
        <TabsContent value="products"><ShopifyProducts /></TabsContent>
        <TabsContent value="inventory"><ShopifyInventory /></TabsContent>
        <TabsContent value="config">
          <ShopifyConfig isConnected={isConnected} setIsConnected={setIsConnected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
