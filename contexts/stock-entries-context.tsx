"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useProducts } from "./products-context"
import { listStockEntries, createStockEntry } from "@/app/actions/stock-entries"

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

interface StockEntriesContextValue {
  entries: StockEntry[]
  loading: boolean
  addEntry: (entry: Omit<StockEntry, "id">) => void
}

const StockEntriesContext = createContext<StockEntriesContextValue | null>(null)

export function StockEntriesProvider({ children }: { children: ReactNode }) {
  const { products, updateProduct } = useProducts()
  const [entries, setEntries] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listStockEntries()
      .then(setEntries)
      .catch((error) => {
        console.error("Failed to load stock entries:", error)
        setEntries([])
      })
      .finally(() => setLoading(false))
  }, [])

  function addEntry(entry: Omit<StockEntry, "id">) {
    // Atualiza o estoque interno (DB de produtos) com o que foi recebido
    entry.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return

      if (item.variantId && product.variants && product.variants.length > 0) {
        const updatedVariants = product.variants.map((v) =>
          v.id === item.variantId ? { ...v, stock: v.stock + item.quantity } : v,
        )
        updateProduct({ ...product, variants: updatedVariants })
      } else {
        updateProduct({ ...product, stock: product.stock + item.quantity })
      }
    })

    // Persiste a entrada no banco
    createStockEntry(entry).then(setEntries).catch((error) => console.error("Failed to create stock entry:", error))
  }

  return (
    <StockEntriesContext.Provider value={{ entries, loading, addEntry }}>{children}</StockEntriesContext.Provider>
  )
}

export function useStockEntries() {
  const ctx = useContext(StockEntriesContext)
  if (!ctx) throw new Error("useStockEntries must be used within a StockEntriesProvider")
  return ctx
}
