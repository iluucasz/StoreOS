"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { Search, Package, AlertTriangle, TrendingDown, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { useProducts } from "@/contexts/products-context"
import { useSuppliers } from "@/contexts/suppliers-context"
import { useStockEntries, type StockEntryItem } from "@/contexts/stock-entries-context"
import { toast } from "@/components/ui/use-toast"

// ─── Types ────────────────────────────────────────────────────────────────────

type StockLevel = "critico" | "baixo" | "ok" | "alto"
type ABCClass = "A" | "B" | "C"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  unitCost: number
  price: number
  monthlySales: number
  revenue: number
  level: StockLevel
  abc: ABCClass
  daysToStockout: number | null
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const items: InventoryItem[] = [
  { id: "1", name: "Vestido Casual", sku: "VES-001", category: "Vestidos", stock: 2, minStock: 5, unitCost: 55, price: 149.9, monthlySales: 18, revenue: 2698.2, level: "critico", abc: "A", daysToStockout: 3 },
  { id: "2", name: "Conjunto Verão", sku: "CON-001", category: "Conjuntos", stock: 3, minStock: 5, unitCost: 52, price: 139.9, monthlySales: 16, revenue: 2238.4, level: "critico", abc: "A", daysToStockout: 6 },
  { id: "3", name: "Blusa Feminina", sku: "BLU-001", category: "Blusas", stock: 8, minStock: 10, unitCost: 32, price: 89.9, monthlySales: 22, revenue: 1977.8, level: "baixo", abc: "A", daysToStockout: 11 },
  { id: "4", name: "Calça Jeans", sku: "CAL-001", category: "Calças", stock: 15, minStock: 8, unitCost: 48, price: 129.9, monthlySales: 14, revenue: 1818.6, level: "ok", abc: "B", daysToStockout: 32 },
  { id: "5", name: "Saia Midi", sku: "SAI-001", category: "Saias", stock: 12, minStock: 6, unitCost: 28, price: 79.9, monthlySales: 10, revenue: 799.0, level: "baixo", abc: "B", daysToStockout: 36 },
  { id: "6", name: "Vestido Longo", sku: "VES-002", category: "Vestidos", stock: 22, minStock: 5, unitCost: 68, price: 189.9, monthlySales: 8, revenue: 1519.2, level: "ok", abc: "B", daysToStockout: 83 },
  { id: "7", name: "Blusa Regata", sku: "BLU-002", category: "Blusas", stock: 35, minStock: 10, unitCost: 22, price: 59.9, monthlySales: 20, revenue: 1198.0, level: "alto", abc: "A", daysToStockout: 53 },
  { id: "8", name: "Shorts Verão", sku: "SHO-001", category: "Shorts", stock: 6, minStock: 8, unitCost: 24, price: 69.9, monthlySales: 7, revenue: 489.3, level: "baixo", abc: "C", daysToStockout: 26 },
  { id: "9", name: "Kimono Floral", sku: "KIM-001", category: "Kimonos", stock: 18, minStock: 4, unitCost: 45, price: 119.9, monthlySales: 5, revenue: 599.5, level: "ok", abc: "C", daysToStockout: null },
  { id: "10", name: "Macacão Longo", sku: "MAC-001", category: "Macacões", stock: 9, minStock: 5, unitCost: 72, price: 199.9, monthlySales: 4, revenue: 799.6, level: "ok", abc: "B", daysToStockout: null },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const levelCfg: Record<StockLevel, { label: string; class: string; bar: string }> = {
  critico: { label: "Crítico", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", bar: "bg-red-500" },
  baixo: { label: "Baixo", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", bar: "bg-yellow-500" },
  ok: { label: "OK", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", bar: "bg-emerald-500" },
  alto: { label: "Alto", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", bar: "bg-blue-500" },
}

const abcCfg: Record<ABCClass, { class: string; desc: string }> = {
  A: { class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", desc: "Top 20%" },
  B: { class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", desc: "Médios" },
  C: { class: "bg-muted text-muted-foreground", desc: "Baixo giro" },
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function Kpi({ title, value, icon: Icon, sub, alert }: { title: string; value: string; icon: LucideIcon; sub?: string; alert?: boolean }) {
  return (
    <Card className={alert ? "border-red-200 dark:border-red-900" : ""}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? "text-red-500" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${alert ? "text-red-500" : ""}`}>{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── ABC Chart ────────────────────────────────────────────────────────────────

function ABCChart() {
  const totalRevenue = items.reduce((s, i) => s + i.revenue, 0)
  const byClass = ["A", "B", "C"].map((cls) => {
    const classItems = items.filter((i) => i.abc === cls)
    const rev = classItems.reduce((s, i) => s + i.revenue, 0)
    return { cls, count: classItems.length, rev, pct: Math.round((rev / totalRevenue) * 100) }
  }) as { cls: ABCClass; count: number; rev: number; pct: number }[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Curva ABC</CardTitle>
        <CardDescription>Classificação por contribuição de receita</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {byClass.map(({ cls, count, rev, pct }) => {
          const cfg = abcCfg[cls]
          return (
            <div key={cls} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${cfg.class}`}>{cls}</span>
                  <span className="text-muted-foreground">{count} produtos</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{pct}%</span>
                  <span className="text-muted-foreground text-xs ml-1">({formatCurrency(rev)})</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${cls === "A" ? "bg-emerald-500" : cls === "B" ? "bg-blue-500" : "bg-muted-foreground/30"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
        <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
          <p><strong>A</strong> — prioridade máxima: nunca pode faltar estoque</p>
          <p><strong>B</strong> — gerencie com atenção moderada</p>
          <p><strong>C</strong> — considere reduzir variedade ou quantidade</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Reorder List ─────────────────────────────────────────────────────────────

function ReorderSuggestions() {
  const needsReorder = items.filter((i) => i.stock <= i.minStock)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Sugestões de Reposição
        </CardTitle>
        <CardDescription>{needsReorder.length} produtos abaixo do mínimo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {needsReorder.map((item) => {
          const suggestedQty = item.minStock * 3 - item.stock
          const estimatedCost = suggestedQty * item.unitCost
          return (
            <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Estoque: <span className="font-semibold text-red-500">{item.stock}</span>
                  {" · "}Mínimo: {item.minStock}
                  {item.daysToStockout !== null && (
                    <span className="text-orange-500"> · Ruptura em ~{item.daysToStockout}d</span>
                  )}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">+{suggestedQty} un.</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(estimatedCost)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ─── Nova Entrada Dialog ──────────────────────────────────────────────────────

interface EntryItemForm {
  uid: string
  productId: string
  variantId: string
  quantity: number
  unitCost: number
}

function NovaEntradaDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { products } = useProducts()
  const { suppliers } = useSuppliers()
  const { addEntry } = useStockEntries()

  const today = new Date().toISOString().slice(0, 10)
  const [supplierId, setSupplierId] = useState("")
  const [date, setDate] = useState(today)
  const [nf, setNf] = useState("")
  const [notes, setNotes] = useState("")
  const [entryItems, setEntryItems] = useState<EntryItemForm[]>([
    { uid: "1", productId: "", variantId: "", quantity: 1, unitCost: 0 },
  ])

  function reset() {
    setSupplierId("")
    setDate(today)
    setNf("")
    setNotes("")
    setEntryItems([{ uid: "1", productId: "", variantId: "", quantity: 1, unitCost: 0 }])
  }

  function addRow() {
    setEntryItems((p) => [...p, { uid: String(Date.now()), productId: "", variantId: "", quantity: 1, unitCost: 0 }])
  }

  function removeRow(uid: string) {
    setEntryItems((p) => p.filter((i) => i.uid !== uid))
  }

  function updateRow(uid: string, field: keyof EntryItemForm, value: string | number) {
    setEntryItems((p) =>
      p.map((i) => {
        if (i.uid !== uid) return i
        const updated = { ...i, [field]: value }
        if (field === "productId") {
          const prod = products.find((p) => String(p.id) === String(value))
          updated.unitCost = prod ? prod.cost : 0
          updated.variantId = ""
        }
        return updated
      })
    )
  }

  const totalCost = entryItems.reduce((s, i) => s + i.quantity * i.unitCost, 0)

  function handleSave() {
    if (!supplierId) { toast({ title: "Selecione um fornecedor", variant: "destructive" }); return }
    const validItems = entryItems.filter((i) => i.productId && i.quantity > 0)
    if (validItems.length === 0) { toast({ title: "Adicione pelo menos um produto", variant: "destructive" }); return }

    const supplier = suppliers.find((s) => s.id === supplierId)
    const mappedItems: StockEntryItem[] = validItems.map((i) => {
      const prod = products.find((p) => String(p.id) === i.productId)
      const variant = prod?.variants?.find((v) => v.id === i.variantId)
      return {
        productId: Number(i.productId),
        productName: prod?.name ?? "",
        variantId: variant ? variant.id : undefined,
        variantLabel: variant ? `${variant.size} / ${variant.color}` : undefined,
        quantity: i.quantity,
        unitCost: i.unitCost,
      }
    })

    addEntry({
      date,
      supplierId,
      supplierName: supplier?.name ?? "",
      nf: nf || undefined,
      items: mappedItems,
      totalCost,
      notes: notes || undefined,
    })

    toast({ title: "Entrada registrada!", description: `${validItems.length} produto(s) · ${formatCurrency(totalCost)}` })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Entrada de Mercadoria</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Fornecedor</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.filter((s) => s.status !== "inativo").map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Data de recebimento</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>
                NF / Nota fiscal{" "}
                <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
              </Label>
              <Input placeholder="NF-2026-xxxx" value={nf} onChange={(e) => setNf(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Itens recebidos</Label>
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addRow}>
                <Plus className="h-3 w-3 mr-1" />
                Adicionar produto
              </Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Produto</th>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground hidden sm:table-cell">Variante</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground w-20">Qtd</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground w-28">Custo/un</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground w-28 hidden sm:table-cell">Subtotal</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {entryItems.map((row) => {
                    const prod = products.find((p) => String(p.id) === row.productId)
                    const hasVariants = prod && prod.variants && prod.variants.length > 0
                    return (
                      <tr key={row.uid} className="border-b last:border-0">
                        <td className="px-2 py-1.5">
                          <Select value={row.productId} onValueChange={(v) => updateRow(row.uid, "productId", v)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Produto..." />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-1.5 hidden sm:table-cell">
                          {hasVariants ? (
                            <Select value={row.variantId} onValueChange={(v) => updateRow(row.uid, "variantId", v)}>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Variante..." />
                              </SelectTrigger>
                              <SelectContent>
                                {prod!.variants.map((v) => (
                                  <SelectItem key={v.id} value={v.id}>{v.size} / {v.color}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-muted-foreground text-xs px-1">Sem variante</span>
                          )}
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => updateRow(row.uid, "quantity", Math.max(1, Number(e.target.value)))}
                            className="h-8 text-sm text-right w-full"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.unitCost}
                            onChange={(e) => updateRow(row.uid, "unitCost", Number(e.target.value))}
                            className="h-8 text-sm text-right w-full"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                          {formatCurrency(row.quantity * row.unitCost)}
                        </td>
                        <td className="px-1 py-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeRow(row.uid)}
                            disabled={entryItems.length === 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1 space-y-1.5">
              <Label>
                Observações{" "}
                <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
              </Label>
              <Textarea
                placeholder="Condições de pagamento, qualidade do lote..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
            </div>
            <div className="rounded-lg bg-muted/40 p-3 space-y-1 text-right shrink-0 min-w-[160px]">
              <p className="text-xs text-muted-foreground">Total da entrada</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-muted-foreground">{entryItems.filter((i) => i.productId).length} produto(s)</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false) }}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Registrar entrada</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Entries Tab ──────────────────────────────────────────────────────────────

function EntradasTab() {
  const { entries } = useStockEntries()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Histórico de entradas</h2>
          <p className="text-xs text-muted-foreground">{entries.length} entradas registradas</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Nenhuma entrada registrada</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-muted/20 transition-colors"
                    onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{entry.supplierName}</span>
                          {entry.nf && (
                            <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{entry.nf}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(entry.date + "T12:00:00").toLocaleDateString("pt-BR")} · {entry.items.length} item(s)
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-sm">{formatCurrency(entry.totalCost)}</span>
                        {expanded === entry.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expanded === entry.id && (
                    <div className="px-4 pb-3 bg-muted/10">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1.5 text-xs font-medium text-muted-foreground">Produto</th>
                            <th className="text-left py-1.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Variante</th>
                            <th className="text-right py-1.5 text-xs font-medium text-muted-foreground">Qtd</th>
                            <th className="text-right py-1.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Custo/un</th>
                            <th className="text-right py-1.5 text-xs font-medium text-muted-foreground">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.items.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-1.5 font-medium">{item.productName}</td>
                              <td className="py-1.5 text-muted-foreground hidden sm:table-cell">
                                {item.variantLabel ?? <span className="text-xs">—</span>}
                              </td>
                              <td className="py-1.5 text-right tabular-nums">{item.quantity}</td>
                              <td className="py-1.5 text-right tabular-nums text-muted-foreground hidden sm:table-cell">{formatCurrency(item.unitCost)}</td>
                              <td className="py-1.5 text-right tabular-nums font-medium">{formatCurrency(item.quantity * item.unitCost)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{entry.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <NovaEntradaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("todos")
  const [abcFilter, setAbcFilter] = useState("todos")

  const totalStock = items.reduce((s, i) => s + i.stock, 0)
  const totalValue = items.reduce((s, i) => s + i.stock * i.unitCost, 0)
  const criticalCount = items.filter((i) => i.level === "critico").length
  const avgDays = Math.round(
    items.filter((i) => i.daysToStockout !== null).reduce((s, i) => s + (i.daysToStockout ?? 0), 0) /
    items.filter((i) => i.daysToStockout !== null).length
  )

  const filtered = items.filter((i) => {
    const s = search.toLowerCase()
    const matchSearch = i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s)
    const matchLevel = levelFilter === "todos" || i.level === levelFilter
    const matchABC = abcFilter === "todos" || i.abc === abcFilter
    return matchSearch && matchLevel && matchABC
  })

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Estoque</h1>
      <p className="text-sm text-muted-foreground mb-6">Gerencie inventário, classifique produtos e registre entradas de mercadoria</p>

      <Tabs defaultValue="estoque">
        <TabsList className="mb-6">
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="entradas">Entradas de Mercadoria</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
            <Kpi title="Total em Estoque" value={`${totalStock} un.`} icon={Package} sub="todas as categorias" />
            <Kpi title="Valor do Estoque" value={formatCurrency(totalValue)} icon={Package} sub="a preço de custo" />
            <Kpi title="Críticos" value={String(criticalCount)} icon={AlertTriangle} sub="precisam reposição urgente" alert={criticalCount > 0} />
            <Kpi title="Dias Médio p/ Ruptura" value={`${avgDays}d`} icon={TrendingDown} sub="produtos com baixo giro" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <ABCChart />
            <ReorderSuggestions />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base">Todos os Produtos</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative flex-1 sm:w-48 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Nível</SelectItem>
                      <SelectItem value="critico">Crítico</SelectItem>
                      <SelectItem value="baixo">Baixo</SelectItem>
                      <SelectItem value="ok">OK</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={abcFilter} onValueChange={setAbcFilter}>
                    <SelectTrigger className="w-[80px] h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">ABC</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Produto</th>
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">ABC</th>
                      <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Estoque</th>
                      <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Giro/mês</th>
                      <th className="text-right px-3 py-2.5 font-medium text-muted-foreground hidden lg:table-cell">Ruptura em</th>
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Nível</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell w-32">Indicador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const lCfg = levelCfg[item.level]
                      const aCfg = abcCfg[item.abc]
                      const barPct = Math.min((item.stock / Math.max(item.minStock * 4, 1)) * 100, 100)
                      return (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-4 py-2.5">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.category}</div>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground hidden sm:table-cell">{item.sku}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${aCfg.class}`}>
                              {item.abc}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <span className={`font-semibold tabular-nums ${item.level === "critico" ? "text-red-500" : item.level === "baixo" ? "text-yellow-600" : ""}`}>
                              {item.stock}
                            </span>
                            <span className="text-xs text-muted-foreground">/{item.minStock}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground hidden md:table-cell tabular-nums">{item.monthlySales}</td>
                          <td className="px-3 py-2.5 text-right hidden lg:table-cell">
                            {item.daysToStockout !== null ? (
                              <span className={item.daysToStockout <= 7 ? "text-red-500 font-medium" : item.daysToStockout <= 14 ? "text-yellow-600" : "text-muted-foreground"}>
                                {item.daysToStockout}d
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${lCfg.class}`}>
                              {lCfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 hidden md:table-cell">
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${lCfg.bar}`} style={{ width: `${barPct}%` }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entradas">
          <EntradasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
