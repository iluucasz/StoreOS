"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, Check, ArrowLeft, BarChart4 } from "lucide-react"
import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { AnalyticsAcquisition } from "./components/analytics-acquisition"
import { AnalyticsEngagement } from "./components/analytics-engagement"
import { AnalyticsConversions } from "./components/analytics-conversions"
import { AnalyticsEcommerce } from "./components/analytics-ecommerce"
import { AnalyticsRealtime } from "./components/analytics-realtime"
import { AnalyticsIntegration } from "./components/analytics-integration"
import Link from "next/link"

export default function GoogleAnalyticsPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketing/google/ads">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para Google Ads
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-[#F4B400]" />
            Google Analytics
          </h1>
          <p className="text-muted-foreground">Analise o desempenho do seu site com Google Analytics 4</p>
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

      <div className="flex items-center gap-2 mb-6">
        <BarChart4 className="h-5 w-5 text-[#DB4437]" />
        <span className="text-sm font-medium">Google Ads</span>
        <span className="text-muted-foreground mx-2">/</span>
        <Activity className="h-5 w-5 text-[#F4B400]" />
        <span className="text-sm font-medium">Google Analytics</span>
      </div>

      <Tabs defaultValue="dashboard" className="mt-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="conversions">Conversões</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AnalyticsDashboard isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="acquisition" className="mt-6">
          <AnalyticsAcquisition isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <AnalyticsEngagement isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="conversions" className="mt-6">
          <AnalyticsConversions isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="ecommerce" className="mt-6">
          <AnalyticsEcommerce isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <AnalyticsRealtime isConnected={isConnected} />
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <AnalyticsIntegration isConnected={isConnected} setIsConnected={setIsConnected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
