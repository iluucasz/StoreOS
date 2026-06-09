"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageCircle, Check } from "lucide-react"
import { WhatsAppDashboard } from "./components/whatsapp-dashboard"
import { WhatsAppTemplates } from "./components/whatsapp-templates"
import { WhatsAppContacts } from "./components/whatsapp-contacts"
import { WhatsAppConfig } from "./components/whatsapp-config"

export default function WhatsAppPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-[#25d366] shrink-0" />
            WhatsApp Business
          </h1>
          <p className="text-muted-foreground">Gerencie mensagens, templates e automações do WhatsApp</p>
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
              <MessageCircle className="mr-2 h-4 w-4" />
              Conectar ao WhatsApp
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <div className="overflow-x-auto mb-6">
          <TabsList className="w-max min-w-full grid grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard"><WhatsAppDashboard /></TabsContent>
        <TabsContent value="templates"><WhatsAppTemplates /></TabsContent>
        <TabsContent value="contacts"><WhatsAppContacts /></TabsContent>
        <TabsContent value="config">
          <WhatsAppConfig isConnected={isConnected} setIsConnected={setIsConnected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
