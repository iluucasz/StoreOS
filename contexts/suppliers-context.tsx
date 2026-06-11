"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  listSuppliers,
  createSupplier,
  updateSupplierAction,
  deleteSupplierAction,
} from "@/app/actions/suppliers"

export type SupplierStatus = "ativo" | "inativo" | "em_avaliacao"
export type SupplierCategory = "Vestuário" | "Embalagem" | "Logística" | "Tecnologia" | "Outros"

export interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  category: SupplierCategory
  leadTimeDays: number
  minOrderValue: number
  totalPurchased: number
  lastOrderDate: string
  status: SupplierStatus
  notes: string
}

interface SuppliersContextValue {
  suppliers: Supplier[]
  loading: boolean
  addSupplier: (s: Omit<Supplier, "id">) => void
  updateSupplier: (id: string, data: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
}

const SuppliersContext = createContext<SuppliersContextValue | null>(null)

export function SuppliersProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listSuppliers()
      .then(setSuppliers)
      .finally(() => setLoading(false))
  }, [])

  const addSupplier = (data: Omit<Supplier, "id">) => {
    createSupplier(data).then(setSuppliers)
  }

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
    updateSupplierAction(id, data).then(setSuppliers)
  }

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
    deleteSupplierAction(id).then(setSuppliers)
  }

  return (
    <SuppliersContext.Provider value={{ suppliers, loading, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliers() {
  const ctx = useContext(SuppliersContext)
  if (!ctx) throw new Error("useSuppliers must be inside SuppliersProvider")
  return ctx
}
