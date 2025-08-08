"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Facebook, Check, ArrowLeft } from "lucide-react"
import { FacebookDashboard } from "./components/facebook-dashboard"
import { FacebookCampaigns } from "./components/facebook-campaigns"
import { FacebookAudiences } from "./components/facebook-audiences"
import { FacebookPixel } from "./components/facebook-pixel"
import { FacebookIntegration } from "./components/facebook-integration"
import Link from "next/link"

export default function FacebookAdsPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketing">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <Facebook className="mr-2 h-6 w-6 text-[#4267B2]" />
            Facebook Ads
          </h1>
          <p className="text-muted-foreground">Gerencie suas campanhas do Facebook Ads</p>
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
              <Facebook className="mr-2 h-4 w-4" />
              Conectar ao Facebook
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="mt-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="audiences">Públicos</TabsTrigger>
          <TabsTrigger value="pixel">Pixel</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <FacebookDashboard isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <FacebookCampaigns isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="audiences" className="mt-6">
          <FacebookAudiences isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="pixel" className="mt-6">
          <FacebookPixel isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <FacebookIntegration isConnected={isConnected} setIsConnected={setIsConnected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
