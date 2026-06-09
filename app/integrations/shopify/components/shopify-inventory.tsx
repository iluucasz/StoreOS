"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ShopifyVariant {
  id: number
  title: string
  sku: string
  inventory_quantity: number
  price: string
}

interface ShopifyProduct {
  id: number
  title: string
  status: string
  variants: ShopifyVariant[]
}

type StockLevel = "critico" | "baixo" | "ok"

function getLevel(stock: number): StockLevel {
  if (stock <= 5) return "critico"
  if (stock <= 15) return "baixo"
  return "ok"
}

const levelCfg: Record<StockLevel, { label: string; class: string; bar: string }> = {
  critico: { label: "Crítico", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", bar: "bg-red-500" },
  baixo: { label: "Baixo", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", bar: "bg-yellow-500" },
  ok: { label: "OK", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", bar: "bg-emerald-500" },
}

export function ShopifyInventory() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/shopify/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setProducts(data.filter((p: ShopifyProduct) => p.status === "active"))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando estoque...</div>
  if (error) return <div className="py-8 text-center text-red-500 text-sm">Erro: {error}</div>

  const rows = products.flatMap((p) =>
    p.variants.map((v) => ({
      id: `${p.id}-${v.id}`,
      name: p.variants.length > 1 ? `${p.title} — ${v.title}` : p.title,
      sku: v.sku || "—",
      stock: v.inventory_quantity ?? 0,
      level: getLevel(v.inventory_quantity ?? 0),
    }))
  )

  const critico = rows.filter((r) => r.level === "critico").length
  const baixo = rows.filter((r) => r.level === "baixo").length
  const maxStock = Math.max(...rows.map((r) => r.stock), 1)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Crítico (≤5)</p>
            <p className="text-xl font-bold text-red-500">{critico}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Baixo (≤15)</p>
            <p className="text-xl font-bold text-yellow-500">{baixo}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">OK</p>
            <p className="text-xl font-bold text-emerald-600">{rows.length - critico - baixo}</p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Produto</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
              <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Estoque</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Nível</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell w-32">Indicador</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const cfg = levelCfg[r.level]
              const pct = Math.min((r.stock / maxStock) * 100, 100)
              return (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-medium">{r.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs hidden sm:table-cell">{r.sku}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{r.stock}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
