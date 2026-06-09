"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageCircle, BarChart2, Facebook, Activity, ArrowRight } from "lucide-react"

const integrations = [
  {
    name: "Shopify",
    description: "Sincronize pedidos, produtos, estoque e faturamento da sua loja Shopify",
    href: "/integrations/shopify",
    icon: ShoppingBag,
    color: "text-[#96bf48]",
    bg: "bg-[#96bf48]/10",
    status: "configurar",
    features: ["Pedidos em tempo real", "Sync de produtos", "Controle de estoque", "Webhook automático"],
  },
  {
    name: "WhatsApp Business",
    description: "Envie notificações, gerencie templates e automatize mensagens para seus clientes",
    href: "/integrations/whatsapp",
    icon: MessageCircle,
    color: "text-[#25d366]",
    bg: "bg-[#25d366]/10",
    status: "configurar",
    features: ["Notificações de pedido", "Templates aprovados", "Carrinho abandonado", "Opt-in de contatos"],
  },
  {
    name: "Meta Ads",
    description: "Conecte suas campanhas do Facebook e Instagram para acompanhar performance",
    href: "/marketing/facebook",
    icon: Facebook,
    color: "text-[#4267B2]",
    bg: "bg-[#4267B2]/10",
    status: "ver",
    features: ["Campanhas ativas", "ROAS por campanha", "Audiências", "Relatórios"],
  },
  {
    name: "Google Ads",
    description: "Monitore palavras-chave e conversões diretamente no StoreOS",
    href: "/marketing/google/ads",
    icon: BarChart2,
    color: "text-[#DB4437]",
    bg: "bg-[#DB4437]/10",
    status: "ver",
    features: ["Campanhas Search", "Palavras-chave", "Quality Score", "Conversões"],
  },
  {
    name: "Google Analytics 4",
    description: "Analise o comportamento dos visitantes e funil de conversão do seu site",
    href: "/marketing/google/analytics",
    icon: Activity,
    color: "text-[#F4B400]",
    bg: "bg-[#F4B400]/10",
    status: "ver",
    features: ["Sessões e usuários", "Aquisição", "E-commerce", "Tempo real"],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Integrações</h1>
      <p className="text-sm text-muted-foreground mb-6">Conecte sua loja às plataformas que você já usa</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((intg) => (
          <Card key={intg.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${intg.bg} mb-3`}>
                  <intg.icon className={`h-6 w-6 ${intg.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {intg.status === "configurar" ? "Disponível" : "Marketing"}
                </Badge>
              </div>
              <CardTitle className="text-base">{intg.name}</CardTitle>
              <CardDescription className="text-sm">{intg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                {intg.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild size="sm" className="w-full" variant={intg.status === "configurar" ? "default" : "outline"}>
                <Link href={intg.href}>
                  {intg.status === "configurar" ? "Configurar" : "Ver Detalhes"}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
