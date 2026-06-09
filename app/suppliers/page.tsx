"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Plus, Search, Truck, Package, DollarSign, Clock } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import {
  SuppliersProvider, useSuppliers,
  type Supplier, type SupplierStatus, type SupplierCategory,
} from "@/contexts/suppliers-context"

// ─── Status config ────────────────────────────────────────────────────────────

const statusCfg: Record<SupplierStatus, { label: string; class: string }> = {
  ativo: { label: "Ativo", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inativo: { label: "Inativo", class: "bg-muted text-muted-foreground" },
  em_avaliacao: { label: "Em Avaliação", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
}

const categories: SupplierCategory[] = ["Vestuário", "Embalagem", "Logística", "Tecnologia", "Outros"]

function StatusBadge({ s }: { s: SupplierStatus }) {
  const cfg = statusCfg[s]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function Kpi({ title, value, icon: Icon, sub }: { title: string; value: string; icon: LucideIcon; sub?: string }) {
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

// ─── Add supplier dialog ──────────────────────────────────────────────────────

function AddSupplierDialog() {
  const { addSupplier } = useSuppliers()
  const [open, setOpen] = useState(false)
  const empty = {
    name: "", contact: "", phone: "", email: "",
    category: "Vestuário" as SupplierCategory,
    leadTimeDays: 7, minOrderValue: 0,
    totalPurchased: 0, lastOrderDate: "",
    status: "ativo" as SupplierStatus, notes: "",
  }
  const [form, setForm] = useState(empty)

  function set(k: string, v: string | number) { setForm(p => ({ ...p, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addSupplier(form)
    setForm(empty)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Fornecedor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Novo Fornecedor</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 pt-2">
          <div className="grid gap-1.5">
            <Label>Nome da Empresa *</Label>
            <Input required value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Contato</Label>
              <Input value={form.contact} onChange={e => set("contact", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={v => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Lead Time (dias)</Label>
              <Input type="number" min={1} value={form.leadTimeDays} onChange={e => set("leadTimeDays", Number(e.target.value))} />
            </div>
            <div className="grid gap-1.5">
              <Label>Pedido Mínimo (R$)</Label>
              <Input type="number" min={0} value={form.minOrderValue} onChange={e => set("minOrderValue", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Salvar Fornecedor</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Supplier detail ──────────────────────────────────────────────────────────

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const { updateSupplier } = useSuppliers()
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{supplier.name}</p>
            <p className="text-xs text-muted-foreground">{supplier.contact}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <StatusBadge s={supplier.status} />
            <span className="text-[11px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">{supplier.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div>
            <p className="text-muted-foreground">Lead time</p>
            <p className="font-medium">{supplier.leadTimeDays}d</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pedido mínimo</p>
            <p className="font-medium">{supplier.minOrderValue > 0 ? formatCurrency(supplier.minOrderValue) : "Sem mínimo"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total comprado</p>
            <p className="font-medium text-emerald-600">{formatCurrency(supplier.totalPurchased)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Último pedido</p>
            <p className="font-medium">
              {supplier.lastOrderDate ? new Date(supplier.lastOrderDate).toLocaleDateString("pt-BR") : "—"}
            </p>
          </div>
        </div>

        {supplier.notes && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mb-3 line-clamp-2">{supplier.notes}</p>
        )}

        <div className="flex gap-2">
          {supplier.email && (
            <a href={`mailto:${supplier.email}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs h-7">Email</Button>
            </a>
          )}
          <Select
            value={supplier.status}
            onValueChange={v => updateSupplier(supplier.id, { status: v as SupplierStatus })}
          >
            <SelectTrigger className="flex-1 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="em_avaliacao">Em Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page content ─────────────────────────────────────────────────────────────

function SuppliersContent() {
  const { suppliers } = useSuppliers()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("todos")

  const ativos = suppliers.filter(s => s.status === "ativo")
  const totalComprado = suppliers.reduce((sum, s) => sum + s.totalPurchased, 0)
  const avgLead = Math.round(ativos.reduce((s, sup) => s + sup.leadTimeDays, 0) / (ativos.length || 1))

  const filtered = suppliers.filter(s => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === "todos" || s.category === catFilter
    return match && matchCat
  })

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Fornecedores</h1>
      <p className="text-sm text-muted-foreground mb-6">Gerencie seus fornecedores e pedidos de reposição</p>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <Kpi title="Fornecedores Ativos" value={String(ativos.length)} icon={Truck} sub="em operação" />
        <Kpi title="Em Avaliação" value={String(suppliers.filter(s => s.status === "em_avaliacao").length)} icon={Package} sub="aguardando aprovação" />
        <Kpi title="Total Comprado" value={formatCurrency(totalComprado)} icon={DollarSign} sub="histórico acumulado" />
        <Kpi title="Lead Time Médio" value={`${avgLead} dias`} icon={Clock} sub="fornecedores ativos" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar fornecedor..." className="pl-8 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Categoria</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <AddSupplierDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(s => <SupplierCard key={s.id} supplier={s} />)}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-10">Nenhum fornecedor encontrado</p>
        )}
      </div>
    </div>
  )
}

export default function SuppliersPage() {
  return <SuppliersProvider><SuppliersContent /></SuppliersProvider>
}
