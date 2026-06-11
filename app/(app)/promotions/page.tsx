"use client"

import { Fragment, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Plus, Tag, Zap, Copy, Trash2, CheckCircle, Check } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import {
  PromotionsProvider, usePromotions,
  type Promotion, type DiscountType, type PromotionStatus,
} from "@/contexts/promotions-context"
import { useToast } from "@/hooks/use-toast"

// ─── Status config ────────────────────────────────────────────────────────────

const statusCfg: Record<PromotionStatus, { label: string; class: string }> = {
  ativo: { label: "Ativo", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  agendado: { label: "Agendado", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  expirado: { label: "Expirado", class: "bg-muted text-muted-foreground" },
  inativo: { label: "Inativo", class: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
}

const typeLabel: Record<DiscountType, string> = {
  percentual: "Percentual",
  fixo: "Valor Fixo",
  frete_gratis: "Frete Grátis",
}

function StatusBadge({ s }: { s: PromotionStatus }) {
  const cfg = statusCfg[s]
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
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

// ─── Copy code button ──────────────────────────────────────────────────────────

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copiar código">
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

// ─── Create promotion dialog ──────────────────────────────────────────────────

function CreatePromotionDialog() {
  const { addPromotion } = usePromotions()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const today = new Date().toISOString().split("T")[0]
  const empty = {
    code: "", description: "",
    type: "percentual" as DiscountType,
    value: 0, minOrderValue: 0,
    usageLimit: null as number | null,
    validFrom: today, validTo: "",
    status: "ativo" as PromotionStatus,
  }
  const [form, setForm] = useState(empty)

  function set(k: string, v: string | number | null) { setForm(p => ({ ...p, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addPromotion(form)
    toast({ title: "Promoção criada", description: `Código ${form.code} criado com sucesso.` })
    setForm(empty)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Promoção</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nova Promoção / Cupom</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 pt-2">
          <div className="grid gap-1.5">
            <Label>Código do Cupom *</Label>
            <Input
              required
              className="uppercase"
              placeholder="ex: BEMVINDO10"
              value={form.code}
              onChange={e => set("code", e.target.value.toUpperCase())}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Descrição</Label>
            <Input value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tipo de Desconto</Label>
              <Select value={form.type} onValueChange={v => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual">Percentual (%)</SelectItem>
                  <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                  <SelectItem value="frete_gratis">Frete Grátis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>{form.type === "percentual" ? "Percentual (%)" : form.type === "fixo" ? "Valor (R$)" : "Valor"}</Label>
              <Input
                type="number"
                min={0}
                disabled={form.type === "frete_gratis"}
                value={form.type === "frete_gratis" ? 0 : form.value}
                onChange={e => set("value", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Pedido Mínimo (R$)</Label>
              <Input type="number" min={0} value={form.minOrderValue} onChange={e => set("minOrderValue", Number(e.target.value))} />
            </div>
            <div className="grid gap-1.5">
              <Label>Limite de Usos</Label>
              <Input
                type="number"
                min={1}
                placeholder="Ilimitado"
                value={form.usageLimit ?? ""}
                onChange={e => set("usageLimit", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Válido de</Label>
              <Input type="date" value={form.validFrom} onChange={e => set("validFrom", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Válido até *</Label>
              <Input required type="date" value={form.validTo} onChange={e => set("validTo", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Status Inicial</Label>
            <Select value={form.status} onValueChange={v => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Criar Promoção</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page content ─────────────────────────────────────────────────────────────

function PromotionsContent() {
  const { promotions, updatePromotion, deletePromotion } = usePromotions()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const ativos = promotions.filter(p => p.status === "ativo")
  const totalUsos = promotions.reduce((sum, p) => sum + p.usageCount, 0)
  const descontos = promotions.filter(p => p.type !== "frete_gratis" && p.value > 0)
  const avgDesconto = descontos.length
    ? Math.round(descontos.reduce((s, p) => s + p.value, 0) / descontos.length)
    : 0
  const agendados = promotions.filter(p => p.status === "agendado")

  const filtered = promotions.filter(p => {
    const match = p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "todos" || p.status === statusFilter
    return match && matchStatus
  })

  function discountDisplay(p: Promotion) {
    if (p.type === "frete_gratis") return "Frete Grátis"
    if (p.type === "percentual") return `${p.value}%`
    return formatCurrency(p.value)
  }

  function usageDisplay(p: Promotion) {
    if (p.usageLimit === null) return `${p.usageCount} usos`
    const pct = Math.round((p.usageCount / p.usageLimit) * 100)
    return `${p.usageCount}/${p.usageLimit} (${pct}%)`
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Cupons & Promoções</h1>
      <p className="text-sm text-muted-foreground mb-6">Gerencie descontos, cupons e campanhas promocionais</p>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <Kpi title="Promoções Ativas" value={String(ativos.length)} icon={Tag} sub="rodando agora" />
        <Kpi title="Agendadas" value={String(agendados.length)} icon={Zap} sub="próximas campanhas" />
        <Kpi title="Total de Usos" value={String(totalUsos)} icon={CheckCircle} sub="todas as promoções" />
        <Kpi title="Desconto Médio" value={`${avgDesconto}%`} icon={Tag} sub="promoções percentuais" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar código ou descrição..."
            className="h-9 sm:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="expirado">Expirado</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreatePromotionDialog />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden lg:table-cell">Válido até</TableHead>
                <TableHead className="hidden md:table-cell">Usos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <Fragment key={p.id}>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="text-sm font-mono font-semibold bg-muted px-1.5 py-0.5 rounded">{p.code}</code>
                        <CopyCodeButton code={p.code} />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                      {p.description}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600">{discountDisplay(p)}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{typeLabel[p.type]}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {new Date(p.validTo).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {usageDisplay(p)}
                    </TableCell>
                    <TableCell><StatusBadge s={p.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Select
                          value={p.status}
                          onValueChange={v => updatePromotion(p.id, { status: v as PromotionStatus })}
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="agendado">Agendado</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                            <SelectItem value="expirado">Expirado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deletePromotion(p.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Nenhuma promoção encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default function PromotionsPage() {
  return <PromotionsProvider><PromotionsContent /></PromotionsProvider>
}
