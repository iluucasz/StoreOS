"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

type AccountStatus = "pendente" | "pago" | "atrasado"

interface Account {
  id: number
  desc: string
  dueDate: string
  value: number
  status: AccountStatus
  category: string
}

const statusCfg: Record<AccountStatus, { label: string; class: string }> = {
  pendente: { label: "Pendente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  pago: { label: "Pago", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  atrasado: { label: "Atrasado", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

function StatusBadge({ s }: { s: AccountStatus }) {
  const cfg = statusCfg[s]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

const today = new Date("2026-06-08")

function isNearDue(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 3
}

const receivables: Account[] = [
  { id: 1, desc: "Pedido #1041 — Carlos Mendes", dueDate: "2026-06-09", value: 389.7, status: "pendente", category: "Vendas" },
  { id: 2, desc: "Pedido #1037 — Roberto Alves", dueDate: "2026-06-08", value: 259.8, status: "pendente", category: "Vendas" },
  { id: 3, desc: "Pedido #1036 — Patrícia Souza", dueDate: "2026-06-07", value: 269.7, status: "pago", category: "Vendas" },
  { id: 4, desc: "Pedido #1034 — Camila Rocha", dueDate: "2026-06-06", value: 429.7, status: "pago", category: "Vendas" },
  { id: 5, desc: "Boleto parcela 2/3 — Atacado Sul", dueDate: "2026-06-15", value: 1200, status: "pendente", category: "Atacado" },
  { id: 6, desc: "Pedido #1033 — Diego Lima", dueDate: "2026-06-02", value: 129.9, status: "atrasado", category: "Vendas" },
]

const payables: Account[] = [
  { id: 1, desc: "Fornecedor Confecções BR", dueDate: "2026-06-10", value: 4200, status: "pendente", category: "Estoque" },
  { id: 2, desc: "Google Ads — fatura Jun", dueDate: "2026-06-08", value: 2100, status: "pendente", category: "Marketing" },
  { id: 3, desc: "Meta Ads — fatura Jun", dueDate: "2026-06-08", value: 4200, status: "pago", category: "Marketing" },
  { id: 4, desc: "Shopify — mensalidade", dueDate: "2026-06-15", value: 149, status: "pendente", category: "SaaS" },
  { id: 5, desc: "Contador — honorário Jun", dueDate: "2026-06-05", value: 800, status: "pago", category: "Administrativo" },
  { id: 6, desc: "Seguro de cargas", dueDate: "2026-06-01", value: 350, status: "atrasado", category: "Operacional" },
]

function AccountTable({ accounts, type }: { accounts: Account[]; type: "receber" | "pagar" }) {
  const pending = accounts.filter((a) => a.status === "pendente" || a.status === "atrasado")
    .reduce((s, a) => s + a.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Contas a {type === "receber" ? "Receber" : "Pagar"}
        </CardTitle>
        <CardDescription>
          Em aberto: <span className={`font-semibold ${type === "receber" ? "text-emerald-600" : "text-red-500"}`}>{formatCurrency(pending)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Descrição</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Vencimento</th>
                <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Valor</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => {
                const near = a.status === "pendente" && isNearDue(a.dueDate)
                return (
                  <tr key={a.id} className={`border-b border-border/50 ${a.status === "atrasado" ? "bg-red-50/50 dark:bg-red-950/10" : ""}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {near && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />}
                        <span className="truncate max-w-[180px]">{a.desc}</span>
                      </div>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {new Date(a.dueDate).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground hidden sm:table-cell">
                      {new Date(a.dueDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums">{formatCurrency(a.value)}</td>
                    <td className="px-4 py-2.5"><StatusBadge s={a.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function Accounts() {
  const totalReceber = receivables.filter((a) => a.status !== "pago").reduce((s, a) => s + a.value, 0)
  const totalPagar = payables.filter((a) => a.status !== "pago").reduce((s, a) => s + a.value, 0)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">A Receber (em aberto)</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalReceber)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">A Pagar (em aberto)</p>
            <p className="text-xl font-bold text-red-500 mt-1">{formatCurrency(totalPagar)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AccountTable accounts={receivables} type="receber" />
        <AccountTable accounts={payables} type="pagar" />
      </div>
    </div>
  )
}
