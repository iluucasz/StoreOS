"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ShopifyVariant {
  id: number
  title: string
  price: string
  inventory_quantity: number
  sku: string
}

interface ShopifyProduct {
  id: number
  title: string
  status: "active" | "draft" | "archived"
  variants: ShopifyVariant[]
}

export function ShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/shopify/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setProducts(data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando produtos...</div>
  if (error) return <div className="py-8 text-center text-red-500 text-sm">Erro: {error}</div>
  if (products.length === 0) return <div className="py-8 text-center text-muted-foreground text-sm">Nenhum produto encontrado.</div>

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Produto</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">ID Shopify</th>
            <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Preço</th>
            <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Estoque</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const price = p.variants[0] ? parseFloat(p.variants[0].price) : 0
            const stock = p.variants.reduce((s, v) => s + (v.inventory_quantity ?? 0), 0)
            const active = p.status === "active"
            return (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-4 py-2.5 font-medium">
                  <div>{p.title}</div>
                  {p.variants.length > 1 && (
                    <div className="text-xs text-muted-foreground">{p.variants.length} variantes</div>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground hidden md:table-cell">{p.id}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(price)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{stock}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    active
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {p.status === "active" ? "Ativo" : p.status === "draft" ? "Rascunho" : "Arquivado"}
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
