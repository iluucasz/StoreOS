"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type TemplateStatus = "aprovado" | "pendente" | "rejeitado"

const templates = [
  {
    id: "1",
    name: "order_confirmation",
    title: "Confirmação de Pedido",
    preview: "Olá {{1}}! Seu pedido {{2}} foi confirmado. Você receberá em {{3}} dias úteis. 🛍️",
    status: "aprovado" as TemplateStatus,
    category: "TRANSACIONAL",
  },
  {
    id: "2",
    name: "order_shipped",
    title: "Pedido Enviado",
    preview: "Seu pedido {{1}} saiu para entrega! Rastreie em: {{2}} 📦",
    status: "aprovado" as TemplateStatus,
    category: "TRANSACIONAL",
  },
  {
    id: "3",
    name: "abandoned_cart",
    title: "Carrinho Abandonado",
    preview: "Oi {{1}}! Você deixou itens no carrinho. Complete sua compra e ganhe frete grátis hoje! 🛒",
    status: "aprovado" as TemplateStatus,
    category: "MARKETING",
  },
  {
    id: "4",
    name: "restock_alert",
    title: "Alerta de Reposição",
    preview: "{{1}}, o produto que você queria voltou ao estoque! Corra antes que esgote novamente 🔔",
    status: "pendente" as TemplateStatus,
    category: "MARKETING",
  },
  {
    id: "5",
    name: "payment_reminder",
    title: "Lembrete de Pagamento",
    preview: "Seu boleto do pedido {{1}} vence amanhã ({{2}}). Pague para garantir seu pedido 💳",
    status: "aprovado" as TemplateStatus,
    category: "TRANSACIONAL",
  },
]

const statusCfg: Record<TemplateStatus, { label: string; class: string }> = {
  aprovado: { label: "Aprovado", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pendente: { label: "Pendente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  rejeitado: { label: "Rejeitado", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

export function WhatsAppTemplates() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((t) => {
        const cfg = statusCfg[t.status]
        return (
          <Card key={t.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">{t.title}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{t.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
                  <Badge variant="outline" className="text-[10px] h-4">{t.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 leading-relaxed">
                {t.preview}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
