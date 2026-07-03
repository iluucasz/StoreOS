"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  Copy,
  Clock3,
  ContactRound,
  Download,
  FileText,
  Filter,
  Globe2,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState, LoadingState } from "@/components/feedback-state"
import { cn, formatCurrency } from "@/lib/utils"
import { getWebToLeadConfig, type ImportLeadInput } from "@/app/actions/crm"
import {
  CRMProvider,
  useCRM,
  type Lead,
  type LeadSource,
  type LeadStatus,
  type Opportunity,
  type OpportunityStage,
} from "@/contexts/crm-context"

const leadSources: LeadSource[] = ["Meta", "Google", "Orgânico", "Indicação", "WhatsApp", "Outro"]
const leadStatuses: LeadStatus[] = ["novo", "contatado", "qualificado", "perdido"]
const stageOrder: OpportunityStage[] = ["prospeccao", "qualificacao", "proposta", "negociacao", "fechado_ganho", "fechado_perdido"]
const openStages: OpportunityStage[] = ["prospeccao", "qualificacao", "proposta", "negociacao"]

const leadStatusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300" },
  contatado: { label: "Contatado", className: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300" },
  qualificado: { label: "Qualificado", className: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300" },
  perdido: { label: "Perdido", className: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300" },
}

const stageConfig: Record<OpportunityStage, { label: string; short: string; probability: number; className: string; accent: string }> = {
  prospeccao: {
    label: "Prospecção",
    short: "Prospecção",
    probability: 15,
    className: "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30",
    accent: "bg-slate-500",
  },
  qualificacao: {
    label: "Qualificação",
    short: "Qualificação",
    probability: 30,
    className: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30",
    accent: "bg-sky-500",
  },
  proposta: {
    label: "Proposta",
    short: "Proposta",
    probability: 55,
    className: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
    accent: "bg-amber-500",
  },
  negociacao: {
    label: "Negociação",
    short: "Negociação",
    probability: 75,
    className: "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30",
    accent: "bg-orange-500",
  },
  fechado_ganho: {
    label: "Fechado ganho",
    short: "Ganho",
    probability: 100,
    className: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
    accent: "bg-emerald-500",
  },
  fechado_perdido: {
    label: "Fechado perdido",
    short: "Perdido",
    probability: 0,
    className: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30",
    accent: "bg-rose-500",
  },
}

type DialogLead = Pick<Lead, "id" | "name" | "estimatedValue" | "notes"> | null

function today() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function daysUntil(dateValue: string) {
  if (!dateValue) return null
  const start = new Date(today()).getTime()
  const end = new Date(dateValue).getTime()
  if (!Number.isFinite(end)) return null
  return Math.ceil((end - start) / 86_400_000)
}

function compactDate(dateValue: string) {
  if (!dateValue) return "Sem data"
  return new Date(dateValue).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function weightedValue(opp: Opportunity) {
  return opp.stage === "fechado_perdido" ? 0 : opp.value * (opp.probability / 100)
}

function searchText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ""
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ","

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"' && quoted && next === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim())
      cell = ""
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ""
    } else {
      cell += char
    }
  }

  row.push(cell.trim())
  if (row.some(Boolean)) rows.push(row)
  return rows
}

function normalizeKey(value: string) {
  return searchText(value).replace(/[^a-z0-9]/g, "")
}

function pick(record: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (value) return value
  }
  return ""
}

function normalizeSource(value: string): LeadSource {
  const normalized = searchText(value)
  return leadSources.find((source) => searchText(source) === normalized) ?? "Outro"
}

function normalizeStatus(value: string): LeadStatus {
  const normalized = searchText(value)
  return leadStatuses.find((status) => searchText(status) === normalized || searchText(leadStatusConfig[status].label) === normalized) ?? "novo"
}

function parseMoney(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function csvToLeads(text: string): ImportLeadInput[] {
  const rows = parseCsv(text)
  const [header = [], ...body] = rows
  const headers = header.map(normalizeKey)

  return body
    .map((row) => {
      const record = Object.fromEntries(headers.map((key, index) => [key, row[index] ?? ""]))
      const name = pick(record, ["nome", "name", "lead", "cliente"])
      const email = pick(record, ["email", "mail", "e-mail"])
      const whatsapp = pick(record, ["whatsapp", "telefone", "phone", "celular", "fone"])
      const source = pick(record, ["origem", "source", "canal"])
      const status = pick(record, ["status", "situacao"])
      const estimatedValue = pick(record, ["valor", "valorestimado", "estimatedvalue", "ticket"])
      const notes = pick(record, ["observacoes", "observacao", "notes", "nota", "mensagem"])

      return {
        name,
        email,
        whatsapp,
        source: normalizeSource(source),
        status: normalizeStatus(status),
        estimatedValue: parseMoney(estimatedValue),
        notes,
      }
    })
    .filter((lead) => lead.name || lead.email || lead.whatsapp || lead.notes)
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const cfg = leadStatusConfig[status]
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1", cfg.className)}>{cfg.label}</span>
}

function StageBadge({ stage }: { stage: OpportunityStage }) {
  const cfg = stageConfig[stage]
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", cfg.className)}>
      {cfg.label}
    </span>
  )
}

function SourceBadge({ source }: { source: LeadSource }) {
  return <Badge variant="secondary" className="rounded-full">{source}</Badge>
}

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
}: {
  title: string
  value: string
  helper: string
  icon: typeof Users
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  )
}

function AddLeadDialog({ compact = false }: { compact?: boolean }) {
  const { addLead } = useCRM()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    source: "Meta" as LeadSource,
    status: "novo" as LeadStatus,
    estimatedValue: "",
    notes: "",
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addLead({ ...form, estimatedValue: Number(form.estimatedValue) || 0 })
    setForm({ name: "", email: "", whatsapp: "", source: "Meta", status: "novo", estimatedValue: "", notes: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={compact ? "sm" : "default"}>
          <Plus className="mr-2 h-4 w-4" />
          Novo lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="lead-name">Nome</Label>
            <Input id="lead-name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-whatsapp">WhatsApp</Label>
              <Input id="lead-whatsapp" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Origem</Label>
              <Select value={form.source} onValueChange={(value) => setForm((current) => ({ ...current, source: value as LeadSource }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadSources.map((source) => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as LeadStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((status) => <SelectItem key={status} value={status}>{leadStatusConfig[status].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-value">Valor estimado</Label>
              <Input id="lead-value" type="number" min="0" placeholder="0" value={form.estimatedValue} onChange={(event) => setForm((current) => ({ ...current, estimatedValue: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-notes">Observações</Label>
            <Textarea id="lead-notes" rows={3} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </div>
          <Button type="submit">Salvar lead</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddContactDialog({ initialLead, triggerLabel = "Novo contato" }: { initialLead?: Lead; triggerLabel?: string }) {
  const { addContact } = useCRM()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: initialLead?.name ?? "",
    email: initialLead?.email ?? "",
    whatsapp: initialLead?.whatsapp ?? "",
    document: "",
    totalSpent: "",
    lastOrderDate: "",
    tags: initialLead ? initialLead.source : "",
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addContact({
      name: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      document: form.document,
      totalSpent: Number(form.totalSpent) || 0,
      lastOrderDate: form.lastOrderDate,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    })
    setForm({ name: "", email: "", whatsapp: "", document: "", totalSpent: "", lastOrderDate: "", tags: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <ContactRound className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo contato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Nome</Label>
              <Input id="contact-name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-document">Documento</Label>
              <Input id="contact-document" value={form.document} onChange={(event) => setForm((current) => ({ ...current, document: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-whatsapp">WhatsApp</Label>
              <Input id="contact-whatsapp" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="contact-spent">Total gasto</Label>
              <Input id="contact-spent" type="number" min="0" value={form.totalSpent} onChange={(event) => setForm((current) => ({ ...current, totalSpent: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-last-order">Último pedido</Label>
              <Input id="contact-last-order" type="date" value={form.lastOrderDate} onChange={(event) => setForm((current) => ({ ...current, lastOrderDate: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-tags">Tags</Label>
              <Input id="contact-tags" placeholder="VIP, atacado" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
            </div>
          </div>
          <Button type="submit">Salvar contato</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddOpportunityDialog({
  initialLead,
  triggerLabel = "Nova oportunidade",
  open,
  onOpenChange,
}: {
  initialLead?: DialogLead
  triggerLabel?: string
  open?: boolean
  onOpenChange?: (value: boolean) => void
}) {
  const { addOpportunity } = useCRM()
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = open ?? internalOpen
  const setDialogOpen = onOpenChange ?? setInternalOpen
  const [form, setForm] = useState({
    title: initialLead ? `Venda para ${initialLead.name}` : "",
    leadName: initialLead?.name ?? "",
    value: initialLead?.estimatedValue ? String(initialLead.estimatedValue) : "",
    stage: "prospeccao" as OpportunityStage,
    probability: "15",
    closingDate: addDays(14),
    notes: initialLead?.notes ?? "",
  })

  useEffect(() => {
    if (!dialogOpen) return
    setForm({
      title: initialLead ? `Venda para ${initialLead.name}` : "",
      leadName: initialLead?.name ?? "",
      value: initialLead?.estimatedValue ? String(initialLead.estimatedValue) : "",
      stage: "prospeccao",
      probability: "15",
      closingDate: addDays(14),
      notes: initialLead?.notes ?? "",
    })
  }, [dialogOpen, initialLead])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addOpportunity({
      leadId: initialLead?.id ?? "",
      leadName: form.leadName,
      title: form.title,
      value: Number(form.value) || 0,
      stage: form.stage,
      probability: Number(form.probability) || stageConfig[form.stage].probability,
      closingDate: form.closingDate,
      notes: form.notes,
    })
    setForm({ title: "", leadName: "", value: "", stage: "prospeccao", probability: "15", closingDate: addDays(14), notes: "" })
    setDialogOpen(false)
  }

  function updateStage(stage: OpportunityStage) {
    setForm((current) => ({ ...current, stage, probability: String(stageConfig[stage].probability) }))
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {open === undefined ? (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Target className="mr-2 h-4 w-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova oportunidade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="opp-title">Título</Label>
            <Input id="opp-title" required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="opp-lead">Cliente ou lead</Label>
              <Input id="opp-lead" required value={form.leadName} onChange={(event) => setForm((current) => ({ ...current, leadName: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="opp-value">Valor</Label>
              <Input id="opp-value" type="number" min="0" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Etapa</Label>
              <Select value={form.stage} onValueChange={(value) => updateStage(value as OpportunityStage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stageOrder.map((stage) => <SelectItem key={stage} value={stage}>{stageConfig[stage].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="opp-probability">Probabilidade</Label>
              <Input id="opp-probability" type="number" min="0" max="100" value={form.probability} onChange={(event) => setForm((current) => ({ ...current, probability: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="opp-date">Fechamento</Label>
              <Input id="opp-date" type="date" value={form.closingDate} onChange={(event) => setForm((current) => ({ ...current, closingDate: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="opp-notes">Notas</Label>
            <Textarea id="opp-notes" rows={3} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </div>
          <Button type="submit">Salvar oportunidade</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CRMKpis() {
  const { leads, contacts, opportunities } = useCRM()
  const openOpportunities = opportunities.filter((opp) => openStages.includes(opp.stage))
  const won = opportunities.filter((opp) => opp.stage === "fechado_ganho")
  const qualifiedLeads = leads.filter((lead) => lead.status === "qualificado").length
  const conversionRate = leads.length ? Math.round(((qualifiedLeads + won.length) / leads.length) * 100) : 0
  const openPipeline = openOpportunities.reduce((sum, opp) => sum + opp.value, 0)
  const weightedPipeline = openOpportunities.reduce((sum, opp) => sum + weightedValue(opp), 0)
  const dueSoon = openOpportunities.filter((opp) => {
    const days = daysUntil(opp.closingDate)
    return days !== null && days <= 7
  }).length

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard title="Leads ativos" value={String(leads.filter((lead) => lead.status !== "perdido").length)} helper={`${leads.filter((lead) => lead.status === "novo").length} novos aguardando contato`} icon={Users} />
      <MetricCard title="Contatos" value={String(contacts.length)} helper={`${contacts.filter((contact) => contact.tags.includes("VIP")).length} marcados como VIP`} icon={UserCheck} />
      <MetricCard title="Pipeline aberto" value={formatCurrency(openPipeline)} helper={`${openOpportunities.length} oportunidades em andamento`} icon={Target} />
      <MetricCard title="Pipeline ponderado" value={formatCurrency(weightedPipeline)} helper="Valor ajustado pela probabilidade" icon={CircleDollarSign} />
      <MetricCard title="Taxa de avanço" value={`${conversionRate}%`} helper={`${dueSoon} fechamento(s) nos próximos 7 dias`} icon={TrendingUp} />
    </div>
  )
}

function CRMInsights() {
  const { leads, opportunities } = useCRM()
  const sourceRows = leadSources.map((source) => {
    const sourceLeads = leads.filter((lead) => lead.source === source)
    const value = sourceLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0)
    const qualified = sourceLeads.filter((lead) => lead.status === "qualificado").length
    return { source, count: sourceLeads.length, value, qualified }
  }).filter((row) => row.count > 0).sort((a, b) => b.value - a.value)

  const followUps = opportunities
    .filter((opp) => openStages.includes(opp.stage))
    .map((opp) => ({ ...opp, days: daysUntil(opp.closingDate) }))
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999))
    .slice(0, 5)

  const openTotal = opportunities.filter((opp) => openStages.includes(opp.stage)).length || 1

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Saúde comercial
          </CardTitle>
          <CardDescription>Distribuição do pipeline e origem dos leads com maior potencial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            {openStages.map((stage) => {
              const count = opportunities.filter((opp) => opp.stage === stage).length
              return (
                <div key={stage} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{stageConfig[stage].short}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <Progress value={(count / openTotal) * 100} className="mt-3 h-2" indicatorClassName={stageConfig[stage].accent} />
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="grid gap-3 md:grid-cols-3">
            {sourceRows.slice(0, 3).map((row) => (
              <div key={row.source} className="rounded-md border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <SourceBadge source={row.source} />
                  <span className="text-xs text-muted-foreground">{row.count} lead(s)</span>
                </div>
                <p className="mt-3 text-lg font-semibold">{formatCurrency(row.value)}</p>
                <p className="text-xs text-muted-foreground">{row.qualified} qualificado(s)</p>
              </div>
            ))}
            {sourceRows.length === 0 ? (
              <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground md:col-span-3">Nenhuma origem com dados ainda.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-primary" />
            Próximos follow-ups
          </CardTitle>
          <CardDescription>Oportunidades abertas ordenadas por data de fechamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {followUps.length === 0 ? (
            <EmptyState title="Sem follow-ups pendentes" description="Crie oportunidades com data de fechamento para montar sua fila comercial." className="min-h-36" />
          ) : (
            followUps.map((opp) => (
              <div key={opp.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{opp.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{opp.leadName} · {stageConfig[opp.stage].short}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">{formatCurrency(opp.value)}</p>
                  <p className={cn("text-xs", (opp.days ?? 99) < 0 ? "text-destructive" : (opp.days ?? 99) <= 3 ? "text-amber-600" : "text-muted-foreground")}>
                    {opp.days === null ? "Sem data" : opp.days < 0 ? `${Math.abs(opp.days)}d atrasado` : opp.days === 0 ? "Hoje" : `${opp.days}d`}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LeadIntakeTab() {
  const { importLeads } = useCRM()
  const [origin, setOrigin] = useState("")
  const [token, setToken] = useState("")
  const [parsedLeads, setParsedLeads] = useState<ImportLeadInput[]>([])
  const [fileName, setFileName] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState<"endpoint" | "snippet" | null>(null)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
    getWebToLeadConfig()
      .then((config) => setToken(config.token))
      .catch(() => setToken(""))
  }, [])

  const endpoint = origin && token ? `${origin}/api/crm/web-to-lead?token=${token}` : ""
  const snippet = endpoint
    ? `<form id="storeos-lead-form">
  <input name="name" placeholder="Nome" required />
  <input name="email" type="email" placeholder="Email" />
  <input name="whatsapp" placeholder="WhatsApp" />
  <input name="source" type="hidden" value="Outro" />
  <input name="campaign" type="hidden" value="Landing page" />
  <textarea name="message" placeholder="Mensagem"></textarea>
  <input name="company_website" tabindex="-1" autocomplete="off" style="display:none" />
  <button type="submit">Enviar</button>
</form>
<script>
document.getElementById("storeos-lead-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  await fetch("${endpoint}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  event.currentTarget.reset();
});
</script>`
    : ""

  async function handleCsv(file: File | null) {
    setMessage("")
    setFileName(file?.name ?? "")
    if (!file) {
      setParsedLeads([])
      return
    }
    const text = await file.text()
    const rows = csvToLeads(text)
    setParsedLeads(rows)
    setMessage(rows.length ? `${rows.length} lead(s) prontos para importar.` : "Nenhum lead válido encontrado no arquivo.")
  }

  async function submitImport() {
    if (!parsedLeads.length) return
    setImporting(true)
    setMessage("")
    try {
      await importLeads(parsedLeads)
      setMessage(`${parsedLeads.length} lead(s) importados com sucesso.`)
      setParsedLeads([])
      setFileName("")
    } catch {
      setMessage("Não foi possível importar os leads agora.")
    } finally {
      setImporting(false)
    }
  }

  function downloadTemplate() {
    const csv = [
      "nome,email,whatsapp,origem,status,valor,observacoes",
      "Maria Silva,maria@email.com,11999999999,Instagram,novo,299.90,Interesse no vestido floral",
      "João Souza,joao@email.com,11988888888,Indicação,contatado,450,Cliente indicado por Maria",
    ].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "modelo-leads-storeos.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  async function copy(value: string, type: "endpoint" | "snippet") {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="h-4 w-4 text-primary" />
            Importação CSV
          </CardTitle>
          <CardDescription>Entrada rápida para listas de campanhas, planilhas e atendimentos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input type="file" accept=".csv,text/csv" onChange={(event) => void handleCsv(event.target.files?.[0] ?? null)} />
            <Button type="button" variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Modelo
            </Button>
          </div>

          <div className="rounded-md border bg-muted/25 p-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {["nome", "email", "whatsapp", "origem", "status", "valor", "observacoes"].map((field) => (
                <Badge key={field} variant="secondary" className="rounded-full">{field}</Badge>
              ))}
            </div>
            {fileName ? <p className="mt-3 text-xs text-muted-foreground">Arquivo: {fileName}</p> : null}
          </div>

          {parsedLeads.length ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedLeads.slice(0, 5).map((lead, index) => (
                    <TableRow key={`${lead.email}-${index}`}>
                      <TableCell className="font-medium">{lead.name || "Lead sem nome"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lead.email || lead.whatsapp || "-"}</TableCell>
                      <TableCell><SourceBadge source={(lead.source as LeadSource) || "Outro"} /></TableCell>
                      <TableCell className="text-right">{formatCurrency(Number(lead.estimatedValue ?? 0))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState icon={FileText} title="Nenhum arquivo selecionado" description="Importe um CSV para revisar os leads antes de salvar." className="min-h-40" />
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{message || "Limite de 500 leads por importação."}</p>
            <Button type="button" onClick={submitImport} disabled={!parsedLeads.length || importing}>
              <Upload className="mr-2 h-4 w-4" />
              {importing ? "Importando..." : "Importar leads"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-primary" />
            Web-to-Lead
          </CardTitle>
          <CardDescription>Receba leads de landing pages, formulários externos e automações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Endpoint público</Label>
            <div className="flex gap-2">
              <Input readOnly value={endpoint || "Gerando endpoint..."} className="font-mono text-xs" />
              <Button type="button" variant="outline" size="icon" disabled={!endpoint} onClick={() => void copy(endpoint, "endpoint")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied === "endpoint" ? <p className="text-xs text-emerald-600">Endpoint copiado.</p> : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Snippet HTML</Label>
              <Button type="button" variant="outline" size="sm" disabled={!snippet} onClick={() => void copy(snippet, "snippet")}>
                <Code2 className="mr-2 h-4 w-4" />
                {copied === "snippet" ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <pre className="max-h-80 overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
              {snippet || "Gerando snippet..."}
            </pre>
          </div>

          <div className="grid gap-2 rounded-md border bg-muted/25 p-3 text-sm">
            <p className="font-medium">Campos aceitos</p>
            <div className="flex flex-wrap gap-2">
              {["name", "email", "whatsapp", "source", "campaign", "page", "message", "estimatedValue"].map((field) => (
                <Badge key={field} variant="secondary" className="rounded-full">{field}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadsTab() {
  const { leads, addContact, updateLead, deleteLead } = useCRM()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LeadStatus | "todos">("todos")
  const [source, setSource] = useState<LeadSource | "todas">("todas")
  const [opportunityLead, setOpportunityLead] = useState<DialogLead>(null)

  const filtered = useMemo(() => {
    const query = searchText(search)
    return leads.filter((lead) => {
      const matchesSearch = !query || searchText(`${lead.name} ${lead.email} ${lead.whatsapp} ${lead.notes}`).includes(query)
      const matchesStatus = status === "todos" || lead.status === status
      const matchesSource = source === "todas" || lead.source === source
      return matchesSearch && matchesStatus && matchesSource
    })
  }, [leads, search, source, status])

  function convertToContact(lead: Lead) {
    addContact({
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp,
      document: "",
      totalSpent: 0,
      lastOrderDate: "",
      tags: [lead.source, "lead convertido"],
    })
    updateLead(lead.id, { status: "qualificado" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_170px_160px] lg:max-w-3xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, email, WhatsApp ou nota" className="pl-8" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value as LeadStatus | "todos")}>
            <SelectTrigger><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {leadStatuses.map((item) => <SelectItem key={item} value={item}>{leadStatusConfig[item].label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={(value) => setSource(value as LeadSource | "todas")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as origens</SelectItem>
              {leadSources.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <AddLeadDialog compact />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="max-w-xs truncate text-xs text-muted-foreground">{lead.notes || "Sem observações"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {lead.email ? <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{lead.email}</div> : null}
                        {lead.whatsapp ? <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{lead.whatsapp}</div> : null}
                      </div>
                    </TableCell>
                    <TableCell><SourceBadge source={lead.source} /></TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(value) => updateLead(lead.id, { status: value as LeadStatus })}>
                        <SelectTrigger className="h-8 w-[132px] border-0 bg-transparent p-0 shadow-none focus:ring-0">
                          <LeadStatusBadge status={lead.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {leadStatuses.map((item) => <SelectItem key={item} value={item}>{leadStatusConfig[item].label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{compactDate(lead.createdAt)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(lead.estimatedValue)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateLead(lead.id, { status: "contatado" })}>Marcar como contatado</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateLead(lead.id, { status: "qualificado" })}>Marcar como qualificado</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setOpportunityLead(lead)}>Criar oportunidade</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => convertToContact(lead)}>Converter em contato</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(lead.id)}>
                            <Trash2 className="h-4 w-4" />
                            Excluir lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 ? <EmptyState title="Nenhum lead encontrado" description="Ajuste os filtros ou cadastre um novo lead." className="m-4" /> : null}
        </CardContent>
      </Card>

      <AddOpportunityDialog initialLead={opportunityLead} open={Boolean(opportunityLead)} onOpenChange={(open) => !open && setOpportunityLead(null)} />
    </div>
  )
}

function ContactsTab() {
  const { contacts, updateContact, deleteContact } = useCRM()
  const [search, setSearch] = useState("")
  const [tag, setTag] = useState("todas")
  const tags = useMemo(() => [...new Set(contacts.flatMap((contact) => contact.tags))].filter(Boolean).sort(), [contacts])
  const filtered = useMemo(() => {
    const query = searchText(search)
    return contacts.filter((contact) => {
      const matchesSearch = !query || searchText(`${contact.name} ${contact.email} ${contact.whatsapp} ${contact.document} ${contact.tags.join(" ")}`).includes(query)
      const matchesTag = tag === "todas" || contact.tags.includes(tag)
      return matchesSearch && matchesTag
    })
  }, [contacts, search, tag])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_180px] sm:max-w-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar contato" className="pl-8" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger><SelectValue placeholder="Tag" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as tags</SelectItem>
              {tags.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <AddContactDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((contact) => (
          <Card key={contact.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{contact.name}</CardTitle>
                  <CardDescription className="truncate">{contact.email || contact.whatsapp || "Contato sem canal cadastrado"}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateContact(contact.id, { tags: [...new Set([...contact.tags, "VIP"])] })}>Marcar como VIP</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateContact(contact.id, { lastOrderDate: today() })}>Atualizar pedido hoje</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteContact(contact.id)}>
                      <Trash2 className="h-4 w-4" />
                      Excluir contato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total gasto</p>
                  <p className="font-semibold">{formatCurrency(contact.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Último pedido</p>
                  <p className="font-semibold">{compactDate(contact.lastOrderDate)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.length ? contact.tags.map((item) => <Badge key={item} variant="secondary" className="rounded-full">{item}</Badge>) : <span className="text-xs text-muted-foreground">Sem tags</span>}
              </div>
              <Separator />
              <div className="grid gap-1 text-xs text-muted-foreground">
                {contact.whatsapp ? <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{contact.whatsapp}</span> : null}
                {contact.document ? <span>Documento: {contact.document}</span> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState title="Nenhum contato encontrado" description="Cadastre clientes ou ajuste os filtros para visualizar contatos." /> : null}
    </div>
  )
}

function OpportunitiesTab() {
  const { opportunities, updateOpportunity, deleteOpportunity } = useCRM()
  const [stage, setStage] = useState<OpportunityStage | "todas">("todas")
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => {
    const query = searchText(search)
    return opportunities.filter((opp) => {
      const matchesStage = stage === "todas" || opp.stage === stage
      const matchesSearch = !query || searchText(`${opp.title} ${opp.leadName} ${opp.notes}`).includes(query)
      return matchesStage && matchesSearch
    })
  }, [opportunities, search, stage])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_190px] sm:max-w-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar oportunidade" className="pl-8" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={stage} onValueChange={(value) => setStage(value as OpportunityStage | "todas")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as etapas</SelectItem>
              {stageOrder.map((item) => <SelectItem key={item} value={item}>{stageConfig[item].label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <AddOpportunityDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Oportunidade</TableHead>
                  <TableHead>Cliente/lead</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Probabilidade</TableHead>
                  <TableHead className="hidden lg:table-cell">Fechamento</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell>
                      <div className="font-medium">{opp.title}</div>
                      <div className="max-w-xs truncate text-xs text-muted-foreground">{opp.notes || "Sem notas"}</div>
                    </TableCell>
                    <TableCell className="text-sm">{opp.leadName}</TableCell>
                    <TableCell>
                      <Select value={opp.stage} onValueChange={(value) => updateOpportunity(opp.id, { stage: value as OpportunityStage, probability: stageConfig[value as OpportunityStage].probability })}>
                        <SelectTrigger className="h-8 w-[150px] border-0 bg-transparent p-0 shadow-none focus:ring-0">
                          <StageBadge stage={opp.stage} />
                        </SelectTrigger>
                        <SelectContent>
                          {stageOrder.map((item) => <SelectItem key={item} value={item}>{stageConfig[item].label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(opp.value)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={opp.probability} className="h-2 w-24" />
                        <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {compactDate(opp.closingDate)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateOpportunity(opp.id, { stage: "fechado_ganho", probability: 100 })}>
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar como ganho
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOpportunity(opp.id, { stage: "fechado_perdido", probability: 0 })}>Marcar como perdido</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteOpportunity(opp.id)}>
                            <Trash2 className="h-4 w-4" />
                            Excluir oportunidade
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 ? <EmptyState title="Nenhuma oportunidade encontrada" description="Crie oportunidades ou ajuste os filtros." className="m-4" /> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function PipelineTab() {
  const { opportunities, moveOpportunity } = useCRM()

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        {stageOrder.map((stage) => {
          const cards = opportunities.filter((opp) => opp.stage === stage)
          const total = cards.reduce((sum, opp) => sum + opp.value, 0)
          const weighted = cards.reduce((sum, opp) => sum + weightedValue(opp), 0)
          const stageIndex = stageOrder.indexOf(stage)

          return (
            <div key={stage} className={cn("flex w-64 flex-col rounded-lg border", stageConfig[stage].className)}>
              <div className="border-b border-current/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide">{stageConfig[stage].label}</p>
                  <Badge variant="secondary" className="rounded-full">{cards.length}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <span className="text-muted-foreground">Total: <b className="text-foreground">{formatCurrency(total)}</b></span>
                  <span className="text-muted-foreground">Pond.: <b className="text-foreground">{formatCurrency(weighted)}</b></span>
                </div>
              </div>
              <div className="min-h-72 flex-1 space-y-2 p-2">
                {cards.map((opp) => {
                  const previous = stageOrder[stageIndex - 1]
                  const next = stageOrder[stageIndex + 1]
                  const days = daysUntil(opp.closingDate)

                  return (
                    <div key={opp.id} className="rounded-md border bg-background p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{opp.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{opp.leadName}</p>
                        </div>
                        <span className="shrink-0 text-xs font-medium">{opp.probability}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                        <span className="font-semibold">{formatCurrency(opp.value)}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {days === null ? "Sem data" : days < 0 ? "Atrasado" : `${days}d`}
                        </span>
                      </div>
                      <Progress value={opp.probability} className="mt-3 h-2" indicatorClassName={stageConfig[stage].accent} />
                      <div className="mt-3 grid grid-cols-2 gap-1">
                        <Button size="sm" variant="outline" className="h-8" disabled={!previous} onClick={() => previous && moveOpportunity(opp.id, previous)}>
                          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                          Voltar
                        </Button>
                        <Button size="sm" variant="outline" className="h-8" disabled={!next} onClick={() => next && moveOpportunity(opp.id, next)}>
                          Avançar
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {cards.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-background/40 text-xs text-muted-foreground">
                    Sem oportunidades
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CRMContent() {
  const { loading } = useCRM()

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <LoadingState label="Carregando CRM..." className="min-h-96" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center rounded-full border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            CRM comercial
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Relacionamento e vendas</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Acompanhe leads, contatos e oportunidades com prioridade clara para o próximo follow-up.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddLeadDialog />
          <AddContactDialog />
          <AddOpportunityDialog />
        </div>
      </div>

      <div className="space-y-6">
        <CRMKpis />
        <CRMInsights />

        <Tabs defaultValue="intake" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max min-w-full grid-cols-5">
              <TabsTrigger value="intake">Captação</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="intake"><LeadIntakeTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="contacts"><ContactsTab /></TabsContent>
          <TabsContent value="opportunities"><OpportunitiesTab /></TabsContent>
          <TabsContent value="pipeline"><PipelineTab /></TabsContent>
        </Tabs>
      </div>
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
