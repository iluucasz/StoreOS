"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Plus, Search, ArrowRight, ArrowLeft, Users, Target, TrendingUp, UserCheck } from "lucide-react"
import {
  CRMProvider,
  useCRM,
  type Lead,
  type LeadSource,
  type LeadStatus,
  type OpportunityStage,
} from "@/contexts/crm-context"

// ─── Status/Stage configs ─────────────────────────────────────────────────────

const leadStatusConfig: Record<LeadStatus, { label: string; class: string }> = {
  novo: { label: "Novo", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  contatado: { label: "Contatado", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  qualificado: { label: "Qualificado", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  perdido: { label: "Perdido", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

const stageConfig: Record<OpportunityStage, { label: string; color: string }> = {
  prospeccao: { label: "Prospecção", color: "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" },
  qualificacao: { label: "Qualificação", color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
  proposta: { label: "Proposta", color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800" },
  negociacao: { label: "Negociação", color: "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800" },
  fechado_ganho: { label: "Fechado Ganho", color: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" },
  fechado_perdido: { label: "Fechado Perdido", color: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
}

const stageOrder: OpportunityStage[] = [
  "prospeccao", "qualificacao", "proposta", "negociacao", "fechado_ganho", "fechado_perdido",
]

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = leadStatusConfig[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
}

// ─── Add Lead Dialog ──────────────────────────────────────────────────────────

function AddLeadDialog() {
  const { addLead } = useCRM()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "", source: "Meta" as LeadSource,
    status: "novo" as LeadStatus, estimatedValue: "", notes: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addLead({ ...form, estimatedValue: Number(form.estimatedValue) || 0 })
    setForm({ name: "", email: "", whatsapp: "", source: "Meta", status: "novo", estimatedValue: "", notes: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Lead</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3 pt-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Origem</Label>
              <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v as LeadSource }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Meta", "Google", "Orgânico", "Indicação", "WhatsApp", "Outro"] as LeadSource[]).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="value">Valor Estimado</Label>
              <Input id="value" type="number" placeholder="R$ 0" value={form.estimatedValue} onChange={(e) => setForm((f) => ({ ...f, estimatedValue: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <Button type="submit" className="w-full">Salvar Lead</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab() {
  const { leads, updateLead } = useCRM()
  const [search, setSearch] = useState("")

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar lead..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <AddLeadDialog />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Contato</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right hidden md:table-cell">Valor est.</TableHead>
              <TableHead className="hidden lg:table-cell">Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-medium text-sm">{lead.name}</div>
                  <div className="text-xs text-muted-foreground sm:hidden">{lead.whatsapp}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  <div className="text-muted-foreground">{lead.email}</div>
                  <div className="text-muted-foreground text-xs">{lead.whatsapp}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{lead.source}</span>
                </TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(v) => updateLead(lead.id, { status: v as LeadStatus })}>
                    <SelectTrigger className="h-7 w-[110px] text-xs border-none p-0 shadow-none focus:ring-0">
                      <StatusBadge status={lead.status} />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(leadStatusConfig) as LeadStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{leadStatusConfig[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell font-medium">
                  {formatCurrency(lead.estimatedValue)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                  {lead.notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab() {
  const { contacts } = useCRM()
  const [search, setSearch] = useState("")

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar contato..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Documento</TableHead>
              <TableHead className="text-right">Total Gasto</TableHead>
              <TableHead className="hidden md:table-cell">Último Pedido</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.email}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {contact.document}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(contact.totalSpent)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {new Date(contact.lastOrderDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map((t) => (
                      <span key={t} className="text-[11px] bg-secondary px-1.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Opportunities Tab ────────────────────────────────────────────────────────

function OpportunitiesTab() {
  const { opportunities } = useCRM()

  const total = opportunities
    .filter((o) => o.stage !== "fechado_perdido")
    .reduce((sum, o) => sum + o.value * (o.probability / 100), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pipeline ponderado: <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Oportunidade</TableHead>
              <TableHead>Cliente/Lead</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Prob.</TableHead>
              <TableHead className="hidden md:table-cell">Fechamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp) => (
              <TableRow key={opp.id}>
                <TableCell>
                  <div className="font-medium text-sm">{opp.title}</div>
                  <div className="text-xs text-muted-foreground">{opp.notes}</div>
                </TableCell>
                <TableCell className="text-sm">{opp.leadName}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${stageConfig[opp.stage].color}`}>
                    {stageConfig[opp.stage].label}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(opp.value)}</TableCell>
                <TableCell className="hidden sm:table-cell text-right text-sm">
                  <span className={opp.probability >= 70 ? "text-emerald-600" : opp.probability >= 40 ? "text-yellow-600" : "text-muted-foreground"}>
                    {opp.probability}%
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {new Date(opp.closingDate).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Pipeline (Kanban) Tab ────────────────────────────────────────────────────

function PipelineTab() {
  const { opportunities, moveOpportunity } = useCRM()

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-3 min-w-max">
        {stageOrder.map((stage) => {
          const cards = opportunities.filter((o) => o.stage === stage)
          const stageTotal = cards.reduce((s, o) => s + o.value, 0)
          const cfg = stageConfig[stage]

          return (
            <div key={stage} className={`w-52 rounded-lg border ${cfg.color} flex flex-col`}>
              {/* Column header */}
              <div className="px-3 pt-3 pb-2 border-b border-current/10">
                <p className="text-xs font-semibold uppercase tracking-wide truncate">{cfg.label}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground">{cards.length} oport.</span>
                  <span className="text-xs font-medium">{formatCurrency(stageTotal)}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 flex-1 min-h-[120px]">
                {cards.map((opp) => {
                  const currentIdx = stageOrder.indexOf(stage)
                  const prevStage = stageOrder[currentIdx - 1]
                  const nextStage = stageOrder[currentIdx + 1]

                  return (
                    <div key={opp.id} className="bg-background rounded-md p-2.5 shadow-sm border border-border/50">
                      <p className="text-sm font-medium leading-tight mb-1">{opp.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{opp.leadName}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold">{formatCurrency(opp.value)}</span>
                        <span className={`text-xs ${opp.probability >= 70 ? "text-emerald-600" : opp.probability >= 40 ? "text-yellow-600" : "text-muted-foreground"}`}>
                          {opp.probability}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {prevStage && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 flex-1 px-1 text-[10px]"
                            onClick={() => moveOpportunity(opp.id, prevStage)}
                          >
                            <ArrowLeft className="h-3 w-3 mr-0.5" />
                            Voltar
                          </Button>
                        )}
                        {nextStage && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 flex-1 px-1 text-[10px]"
                            onClick={() => moveOpportunity(opp.id, nextStage)}
                          >
                            Avançar
                            <ArrowRight className="h-3 w-3 ml-0.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {cards.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">Vazio</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

function CRMKpis() {
  const { leads, contacts, opportunities } = useCRM()

  const openPipeline = opportunities
    .filter((o) => o.stage !== "fechado_perdido" && o.stage !== "fechado_ganho")
    .reduce((s, o) => s + o.value, 0)

  const wonThisMonth = opportunities
    .filter((o) => o.stage === "fechado_ganho")
    .reduce((s, o) => s + o.value, 0)

  const newLeads = leads.filter((l) => l.status === "novo").length

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
      {[
        { title: "Leads Totais", value: String(leads.length), sub: `${newLeads} novos`, icon: Users },
        { title: "Contatos Ativos", value: String(contacts.length), sub: "clientes cadastrados", icon: UserCheck },
        { title: "Pipeline Aberto", value: formatCurrency(openPipeline), sub: "em negociação", icon: Target },
        { title: "Ganhos no Mês", value: formatCurrency(wonThisMonth), sub: "fechamentos", icon: TrendingUp },
      ].map(({ title, value, sub, icon: Icon }) => (
        <Card key={title}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CRMContent() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">CRM</h1>
      <p className="text-sm text-muted-foreground mb-6">Gerencie leads, contatos e oportunidades da sua loja</p>

      <CRMKpis />

      <Tabs defaultValue="leads">
        <div className="overflow-x-auto mb-4">
          <TabsList className="w-max min-w-full grid grid-cols-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="leads"><LeadsTab /></TabsContent>
        <TabsContent value="contacts"><ContactsTab /></TabsContent>
        <TabsContent value="opportunities"><OpportunitiesTab /></TabsContent>
        <TabsContent value="pipeline"><PipelineTab /></TabsContent>
      </Tabs>
    </div>
  )
}

export default function CRMPage() {
  return (
    <CRMProvider>
      <CRMContent />
    </CRMProvider>
  )
}
