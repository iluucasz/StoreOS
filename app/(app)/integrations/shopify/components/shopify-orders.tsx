"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type FinancialStatus = "pending" | "paid" | "partially_paid" | "refunded" | "voided" | "partially_refunded"
type FulfillmentStatus = "fulfilled" | "partial" | "restocked" | null

interface ShopifyOrder {
  id: number
  name: string
  email: string
  created_at: string
  total_price: string
  financial_status: FinancialStatus
  fulfillment_status: FulfillmentStatus
  customer?: { first_name: string; last_name: string }
  line_items: { name: string }[]
}

type DisplayStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado"

function resolveStatus(o: ShopifyOrder): DisplayStatus {
  if (o.financial_status === "refunded" || o.financial_status === "voided") return "cancelado"
  if (o.fulfillment_status === "fulfilled") return "entregue"
  if (o.fulfillment_status === "partial") return "enviado"
  if (o.financial_status === "paid") return "pago"
  return "pendente"
}

const statusCfg: Record<DisplayStatus, { label: string; class: string }> = {
  pendente: { label: "Pendente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  pago: { label: "Pago", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  enviado: { label: "Enviado", class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  entregue: { label: "Entregue", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelado: { label: "Cancelado", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

export function ShopifyOrders() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/shopify/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setOrders(Array.isArray(data) ? data : data.orders ?? [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando pedidos...</div>
  if (error) return <div className="py-8 text-center text-red-500 text-sm">Erro ao carregar pedidos: {error}</div>
  if (orders.length === 0) return <div className="py-8 text-center text-muted-foreground text-sm">Nenhum pedido encontrado.</div>

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Pedido</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Cliente</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Data</th>
            <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Total</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const status = resolveStatus(o)
            const cfg = statusCfg[status]
            const customerName = o.customer
              ? `${o.customer.first_name} ${o.customer.last_name}`.trim()
              : o.email || "—"
            return (
              <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-4 py-2.5 font-mono font-medium">{o.name}</td>
                <td className="px-3 py-2.5">{customerName}</td>
                <td className="px-3 py-2.5 text-muted-foreground hidden sm:table-cell">
                  {new Date(o.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                  {formatCurrency(parseFloat(o.total_price))}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>
                    {cfg.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
