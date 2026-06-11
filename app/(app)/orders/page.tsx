"use client"

import { Fragment, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { Search, ShoppingCart, DollarSign, Clock, XCircle, ChevronDown, ChevronUp, RotateCcw, Download, ArrowLeftRight } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { downloadCSV } from "@/lib/export-csv"

// ─── Devoluções mock data ──────────────────────────────────────────────────────

type ReturnMotivo = "defeito" | "arrependimento" | "tamanho" | "outro"
type ReturnStatus = "aguardando" | "aprovada" | "reembolsada" | "recusada"

type Return = {
  id: string
  orderId: string
  customer: string
  product: string
  date: string
  motivo: ReturnMotivo
  freteResponsavel: "loja" | "cliente"
  valor: number
  status: ReturnStatus
}

const mockReturns: Return[] = [
  { id: "R001", orderId: "#1035", customer: "Lucas Ferreira", product: "Saia Midi", date: "2026-06-05", motivo: "arrependimento", freteResponsavel: "cliente", valor: 79.9, status: "reembolsada" },
  { id: "R002", orderId: "#1033", customer: "Diego Lima", product: "Calça Jeans", date: "2026-06-03", motivo: "tamanho", freteResponsavel: "loja", valor: 129.9, status: "aprovada" },
  { id: "R003", orderId: "#1038", customer: "Mariana Santos", product: "Vestido Casual", date: "2026-06-07", motivo: "defeito", freteResponsavel: "loja", valor: 149.9, status: "aguardando" },
  { id: "R004", orderId: "#1039", customer: "João Pereira", product: "Saia Midi", date: "2026-06-06", motivo: "outro", freteResponsavel: "cliente", valor: 79.9, status: "recusada" },
]

const returnStatusCfg: Record<ReturnStatus, { label: string; class: string }> = {
  aguardando: { label: "Aguardando", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  aprovada: { label: "Aprovada", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  reembolsada: { label: "Reembolsada", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  recusada: { label: "Recusada", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

const motivoLabel: Record<ReturnMotivo, string> = {
  defeito: "Defeito",
  arrependimento: "Arrependimento",
  tamanho: "Tamanho errado",
  outro: "Outro",
}

function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const cfg = returnStatusCfg[status]
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

// ─── Trocas mock data ──────────────────────────────────────────────────────────

type TrocaStatus = "aguardando_devolucao" | "item_recebido" | "novo_enviado" | "concluida" | "cancelada"

type Troca = {
  id: string
  orderId: string
  customer: string
  productReturned: string
  sizeReturned: string
  productSent: string
  sizeSent: string
  date: string
  motivo: string
  status: TrocaStatus
}

const mockTrocas: Troca[] = [
  { id: "T001", orderId: "#1041", customer: "Carlos Mendes", productReturned: "Vestido Casual", sizeReturned: "P", productSent: "Vestido Casual", sizeSent: "M", date: "2026-06-08", motivo: "Tamanho pequeno", status: "aguardando_devolucao" },
  { id: "T002", orderId: "#1034", customer: "Camila Rocha", productReturned: "Conjunto Verão", sizeReturned: "G", productSent: "Conjunto Verão", sizeSent: "M", date: "2026-06-06", motivo: "Tamanho grande", status: "item_recebido" },
  { id: "T003", orderId: "#1036", customer: "Patrícia Souza", productReturned: "Blusa Feminina", sizeReturned: "M", productSent: "Blusa Feminina", sizeSent: "G", date: "2026-06-05", motivo: "Tamanho errado", status: "novo_enviado" },
  { id: "T004", orderId: "#1039", customer: "João Pereira", productReturned: "Saia Midi", sizeReturned: "P", productSent: "Calça Jeans", sizeSent: "38", date: "2026-06-03", motivo: "Preferência por outro produto", status: "concluida" },
]

const trocaStatusCfg: Record<TrocaStatus, { label: string; class: string }> = {
  aguardando_devolucao: { label: "Aguardando devolução", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  item_recebido: { label: "Item recebido", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  novo_enviado: { label: "Novo enviado", class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  concluida: { label: "Concluída", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelada: { label: "Cancelada", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

function TrocaStatusBadge({ status }: { status: TrocaStatus }) {
  const cfg = trocaStatusCfg[status]
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

function TrocasTab() {
  const [statusFilter, setStatusFilter] = useState("todos")
  const filtered = mockTrocas.filter(t => statusFilter === "todos" || t.status === statusFilter)
  const emAndamento = mockTrocas.filter(t => t.status !== "concluida" && t.status !== "cancelada").length

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trocas</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{mockTrocas.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{emAndamento}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{mockTrocas.filter(t => t.status === "concluida").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{mockTrocas.filter(t => t.status === "aguardando_devolucao").length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Registro de Trocas</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aguardando_devolucao">Aguardando devolução</SelectItem>
                <SelectItem value="item_recebido">Item recebido</SelectItem>
                <SelectItem value="novo_enviado">Novo enviado</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden sm:table-cell">Devolvido</TableHead>
                  <TableHead className="hidden sm:table-cell">Enviado</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-xs">{t.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{t.customer}</p>
                      <p className="text-xs text-muted-foreground">{t.orderId}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      <p>{t.productReturned}</p>
                      <p className="text-xs text-muted-foreground">Tam. {t.sizeReturned}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      <p>{t.productSent}</p>
                      <p className="text-xs text-muted-foreground">Tam. {t.sizeSent}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell><TrocaStatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma troca encontrada</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DevolucoesTab() {
  const [statusFilter, setStatusFilter] = useState("todos")
  const filtered = mockReturns.filter(r => statusFilter === "todos" || r.status === statusFilter)
  const totalValor = filtered.reduce((s, r) => s + r.valor, 0)
  const aguardando = mockReturns.filter(r => r.status === "aguardando").length

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devoluções</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{mockReturns.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{aguardando}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Aberto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockReturns.filter(r => r.status !== "reembolsada" && r.status !== "recusada").reduce((s, r) => s + r.valor, 0))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reembolsado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(mockReturns.filter(r => r.status === "reembolsada").reduce((s, r) => s + r.valor, 0))}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Registro de Devoluções</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="reembolsada">Reembolsada</SelectItem>
                <SelectItem value="recusada">Recusada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="hidden sm:table-cell">Motivo</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Frete</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="text-sm font-medium">{r.customer}</TableCell>
                    <TableCell className="text-sm">{r.product}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{motivoLabel[r.motivo]}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(r.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm capitalize">{r.freteResponsavel}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(r.valor)}</TableCell>
                    <TableCell><ReturnStatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma devolução encontrada</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado"

type OrderItem = { name: string; qty: number; price: number }

type Order = {
  id: string
  customer: string
  email: string
  date: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  address: string
  tracking?: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockOrders: Order[] = [
  {
    id: "#1042",
    customer: "Ana Lima",
    email: "ana.lima@email.com",
    date: "2026-06-08",
    items: [{ name: "Conjunto Verão", qty: 1, price: 139.9 }],
    total: 139.9,
    status: "pendente",
    address: "Rua das Flores, 123 — São Paulo, SP",
  },
  {
    id: "#1041",
    customer: "Carlos Mendes",
    email: "carlos@email.com",
    date: "2026-06-07",
    items: [
      { name: "Vestido Casual", qty: 2, price: 149.9 },
      { name: "Blusa Feminina", qty: 1, price: 89.9 },
    ],
    total: 389.7,
    status: "pago",
    address: "Av. Paulista, 900 — São Paulo, SP",
  },
  {
    id: "#1040",
    customer: "Fernanda Costa",
    email: "fernanda@email.com",
    date: "2026-06-07",
    items: [{ name: "Calça Jeans", qty: 1, price: 129.9 }],
    total: 129.9,
    status: "enviado",
    address: "Rua Augusta, 500 — São Paulo, SP",
    tracking: "BR123456789BR",
  },
  {
    id: "#1039",
    customer: "João Pereira",
    email: "joao@email.com",
    date: "2026-06-06",
    items: [
      { name: "Conjunto Verão", qty: 1, price: 139.9 },
      { name: "Saia Midi", qty: 1, price: 79.9 },
    ],
    total: 219.8,
    status: "entregue",
    address: "Rua Oscar Freire, 200 — São Paulo, SP",
    tracking: "BR987654321BR",
  },
  {
    id: "#1038",
    customer: "Mariana Santos",
    email: "mariana@email.com",
    date: "2026-06-06",
    items: [{ name: "Vestido Casual", qty: 1, price: 149.9 }],
    total: 149.9,
    status: "entregue",
    address: "Rua Consolação, 400 — São Paulo, SP",
    tracking: "BR555555555BR",
  },
  {
    id: "#1037",
    customer: "Roberto Alves",
    email: "roberto@email.com",
    date: "2026-06-05",
    items: [{ name: "Calça Jeans", qty: 2, price: 129.9 }],
    total: 259.8,
    status: "pago",
    address: "Rua Bela Cintra, 700 — São Paulo, SP",
  },
  {
    id: "#1036",
    customer: "Patrícia Souza",
    email: "patricia@email.com",
    date: "2026-06-04",
    items: [{ name: "Blusa Feminina", qty: 3, price: 89.9 }],
    total: 269.7,
    status: "enviado",
    address: "Al. Santos, 1000 — São Paulo, SP",
    tracking: "BR111222333BR",
  },
  {
    id: "#1035",
    customer: "Lucas Ferreira",
    email: "lucas@email.com",
    date: "2026-06-04",
    items: [{ name: "Saia Midi", qty: 1, price: 79.9 }],
    total: 79.9,
    status: "cancelado",
    address: "Rua Peixoto Gomide, 300 — São Paulo, SP",
  },
  {
    id: "#1034",
    customer: "Camila Rocha",
    email: "camila@email.com",
    date: "2026-06-03",
    items: [
      { name: "Conjunto Verão", qty: 2, price: 139.9 },
      { name: "Vestido Casual", qty: 1, price: 149.9 },
    ],
    total: 429.7,
    status: "entregue",
    address: "Rua Frei Caneca, 600 — São Paulo, SP",
    tracking: "BR666777888BR",
  },
  {
    id: "#1033",
    customer: "Diego Lima",
    email: "diego@email.com",
    date: "2026-06-02",
    items: [{ name: "Calça Jeans", qty: 1, price: 129.9 }],
    total: 129.9,
    status: "cancelado",
    address: "Rua da Consolação, 800 — São Paulo, SP",
  },
]

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  pendente: { label: "Pendente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  pago: { label: "Pago", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  enviado: { label: "Enviado", class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  entregue: { label: "Entregue", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelado: { label: "Cancelado", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ title, value, icon: Icon, sub }: { title: string; value: string; icon: LucideIcon; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Shopify order types ──────────────────────────────────────────────────────

interface ShopifyLineItem { name: string; quantity: number; price: string }
interface ShopifyAddress { address1: string; city: string; province: string; zip: string }
interface ShopifyOrder {
  id: number
  name: string
  email: string
  created_at: string
  total_price: string
  financial_status: string
  fulfillment_status: string | null
  customer?: { first_name: string; last_name: string }
  line_items: ShopifyLineItem[]
  shipping_address?: ShopifyAddress
  tracking_number?: string | null
}

function mapShopifyStatus(o: ShopifyOrder): OrderStatus {
  if (o.financial_status === "refunded" || o.financial_status === "voided") return "cancelado"
  if (o.fulfillment_status === "fulfilled") return "entregue"
  if (o.fulfillment_status === "partial") return "enviado"
  if (o.financial_status === "paid") return "pago"
  return "pendente"
}

function mapShopifyOrder(o: ShopifyOrder): Order {
  const addr = o.shipping_address
  return {
    id: o.name,
    customer: o.customer ? `${o.customer.first_name} ${o.customer.last_name}`.trim() : "—",
    email: o.email,
    date: o.created_at.split("T")[0],
    items: o.line_items.map((li) => ({ name: li.name, qty: li.quantity, price: parseFloat(li.price) })),
    total: parseFloat(o.total_price),
    status: mapShopifyStatus(o),
    address: addr ? `${addr.address1} — ${addr.city}, ${addr.province}` : "—",
    tracking: o.tracking_number ?? undefined,
  }
}

// ─── Pedidos Tab ──────────────────────────────────────────────────────────────

function PedidosTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "todos" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Todos os Pedidos</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-56 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedido ou cliente..."
                  className="pl-8 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden sm:table-cell">Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Carregando pedidos da Shopify...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((order) => (
                    <Fragment key={order.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      >
                        <TableCell className="pl-6 font-mono text-sm font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{order.customer}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">{order.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell>
                          {expandedId === order.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedId === order.id && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={7} className="pl-6 pb-4">
                            <div className="grid gap-4 sm:grid-cols-3 text-sm pt-2">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Itens</p>
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{item.qty}× {item.name}</span>
                                    <span className="text-muted-foreground">{formatCurrency(item.price * item.qty)}</span>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Endereço</p>
                                <p className="text-muted-foreground">{order.address}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Rastreio</p>
                                {order.tracking ? (
                                  <p className="font-mono text-primary">{order.tracking}</p>
                                ) : (
                                  <p className="text-muted-foreground">—</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrdersPage() {
  const [shopifyOrders, setShopifyOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/shopify/orders")
      .then((r) => r.json())
      .then((data: ShopifyOrder[]) => {
        if (!Array.isArray(data)) return
        setShopifyOrders(data.map(mapShopifyOrder))
      })
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const todayOrders = shopifyOrders.filter((o) => o.date === today)
  const todayRevenue = todayOrders.reduce((sum, o) => (o.status !== "cancelado" ? sum + o.total : sum), 0)
  const pending = shopifyOrders.filter((o) => o.status === "pendente").length
  const cancelled = shopifyOrders.filter((o) => o.status === "cancelado").length

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
      <p className="text-sm text-muted-foreground mb-6">Acompanhe e gerencie todos os pedidos da sua loja</p>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <KpiCard title="Pedidos hoje" value={loading ? "—" : String(todayOrders.length)} icon={ShoppingCart} sub="novos pedidos" />
        <KpiCard title="Receita hoje" value={loading ? "—" : formatCurrency(todayRevenue)} icon={DollarSign} sub="pedidos não cancelados" />
        <KpiCard title="Pendentes" value={loading ? "—" : String(pending)} icon={Clock} sub="aguardando pagamento" />
        <KpiCard title="Cancelados" value={loading ? "—" : String(cancelled)} icon={XCircle} sub="este mês" />
      </div>

      <Tabs defaultValue="pedidos">
        <div className="flex items-center justify-between gap-4 mb-1">
          <TabsList>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="devolucoes">Devoluções</TabsTrigger>
            <TabsTrigger value="trocas">Trocas</TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 shrink-0"
            onClick={() => downloadCSV("pedidos.csv", shopifyOrders.map(o => ({
              "ID": o.id,
              "Cliente": o.customer,
              "Email": o.email,
              "Data": o.date,
              "Itens": o.items.length,
              "Total": o.total,
              "Status": o.status,
            })))}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <TabsContent value="pedidos">
          <PedidosTab orders={shopifyOrders} loading={loading} />
        </TabsContent>
        <TabsContent value="devolucoes">
          <DevolucoesTab />
        </TabsContent>
        <TabsContent value="trocas">
          <TrocasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
