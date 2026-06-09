"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useProducts } from "./products-context"

export interface StockEntryItem {
  productId: number
  productName: string
  variantId?: string
  variantLabel?: string
  quantity: number
  unitCost: number
}

export interface StockEntry {
  id: string
  date: string
  supplierId: string
  supplierName: string
  nf?: string
  items: StockEntryItem[]
  totalCost: number
  notes?: string
}

const seed: StockEntry[] = [
  {
    id: "e1",
    date: "2026-05-28",
    supplierId: "s1",
    supplierName: "Confecções Brasil Ltda",
    nf: "NF-2026-1042",
    items: [
      { productId: 1, productName: "Blusa Feminina", variantId: "v1", variantLabel: "P / Branco", quantity: 10, unitCost: 35 },
      { productId: 1, productName: "Blusa Feminina", variantId: "v2", variantLabel: "M / Branco", quantity: 10, unitCost: 35 },
      { productId: 3, productName: "Vestido Casual", quantity: 8, unitCost: 50 },
    ],
    totalCost: 1100,
  },
  {
    id: "e2",
    date: "2026-06-01",
    supplierId: "s2",
    supplierName: "Moda Sul Atacado",
    nf: "NF-2026-0081",
    items: [
      { productId: 2, productName: "Calça Jeans", variantId: "v4", variantLabel: "38 / Azul", quantity: 5, unitCost: 45 },
      { productId: 2, productName: "Calça Jeans", variantId: "v5", variantLabel: "40 / Azul", quantity: 5, unitCost: 45 },
      { productId: 4, productName: "Saia Midi", quantity: 12, unitCost: 30 },
    ],
    totalCost: 810,
  },
  {
    id: "e3",
    date: "2026-06-05",
    supplierId: "s1",
    supplierName: "Confecções Brasil Ltda",
    nf: "NF-2026-1089",
    items: [
      { productId: 5, productName: "Conjunto Verão", variantId: "v7", variantLabel: "P / Rosa", quantity: 6, unitCost: 48 },
      { productId: 5, productName: "Conjunto Verão", variantId: "v8", variantLabel: "M / Rosa", quantity: 6, unitCost: 48 },
    ],
    totalCost: 576,
  },
]

interface StockEntriesContextValue {
  entries: StockEntry[]
  addEntry: (entry: Omit<StockEntry, "id">) => void
}

const StockEntriesContext = createContext<StockEntriesContextValue | null>(null)

export function StockEntriesProvider({ children }: { children: ReactNode }) {
  const { products, updateProduct } = useProducts()

  const [entries, setEntries] = useState<StockEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stock-entries")
      if (saved) return JSON.parse(saved)
    }
    return seed
  })

  useEffect(() => {
    localStorage.setItem("stock-entries", JSON.stringify(entries))
  }, [entries])

  function addEntry(entry: Omit<StockEntry, "id">) {
    const newEntry: StockEntry = { ...entry, id: `e${Date.now()}` }

    entry.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return

      if (item.variantId && product.variants && product.variants.length > 0) {
        const updatedVariants = product.variants.map((v) =>
          v.id === item.variantId ? { ...v, stock: v.stock + item.quantity } : v
        )
        updateProduct({ ...product, variants: updatedVariants })
      } else {
        updateProduct({ ...product, stock: product.stock + item.quantity })
      }
    })

    setEntries((prev) => [newEntry, ...prev])
  }

  return (
    <StockEntriesContext.Provider value={{ entries, addEntry }}>
      {children}
    </StockEntriesContext.Provider>
  )
}

export function useStockEntries() {
  const ctx = useContext(StockEntriesContext)
  if (!ctx) throw new Error("useStockEntries must be used within a StockEntriesProvider")
  return ctx
}
