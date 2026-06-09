"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
  addSupplier: (s: Omit<Supplier, "id">) => void
  updateSupplier: (id: string, data: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
}

const seed: Supplier[] = [
  { id: "s1", name: "Confecções Brasil Ltda", contact: "Marcos Oliveira", phone: "(11) 3333-1111", email: "comercial@confbrasil.com", category: "Vestuário", leadTimeDays: 7, minOrderValue: 500, totalPurchased: 18400, lastOrderDate: "2026-05-28", status: "ativo", notes: "Prazo de pagamento 30 dias. Entrega via transportadora própria." },
  { id: "s2", name: "Moda Sul Atacado", contact: "Fernanda Lima", phone: "(51) 99888-2222", email: "vendas@modasul.com.br", category: "Vestuário", leadTimeDays: 10, minOrderValue: 800, totalPurchased: 12600, lastOrderDate: "2026-06-01", status: "ativo", notes: "Coleção nova em julho. Enviar ordem até 15/06." },
  { id: "s3", name: "PackBox Embalagens", contact: "Ricardo Torres", phone: "(21) 2222-3333", email: "ric@packbox.com", category: "Embalagem", leadTimeDays: 5, minOrderValue: 200, totalPurchased: 3200, lastOrderDate: "2026-05-15", status: "ativo", notes: "Desconto de 8% a partir de 500 unidades." },
  { id: "s4", name: "Rápido Log Transportes", contact: "Ana Ferreira", phone: "(11) 4444-5555", email: "ana@rapidolog.com.br", category: "Logística", leadTimeDays: 2, minOrderValue: 0, totalPurchased: 5800, lastOrderDate: "2026-06-07", status: "ativo", notes: "Coleta diária às 18h. Frete com desconto para volumes acima de 30 caixas." },
  { id: "s5", name: "TechPrint Labels", contact: "Bruno Melo", phone: "(11) 5555-6666", email: "bruno@techprint.com", category: "Embalagem", leadTimeDays: 3, minOrderValue: 150, totalPurchased: 1400, lastOrderDate: "2026-04-20", status: "em_avaliacao", notes: "Novo fornecedor — aguardando aprovação do primeiro lote." },
  { id: "s6", name: "Atacado Fashion Rio", contact: "Clara Duarte", phone: "(21) 7777-8888", email: "clara@fashionrio.com", category: "Vestuário", leadTimeDays: 12, minOrderValue: 1000, totalPurchased: 0, lastOrderDate: "", status: "em_avaliacao", notes: "Cotação solicitada em 05/06." },
]

const SuppliersContext = createContext<SuppliersContextValue | null>(null)

function uid() { return Math.random().toString(36).slice(2, 9) }

export function SuppliersProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("storeosSuppliers")
      if (saved) return JSON.parse(saved)
    }
    return seed
  })

  useEffect(() => {
    localStorage.setItem("storeosSuppliers", JSON.stringify(suppliers))
  }, [suppliers])

  const addSupplier = (data: Omit<Supplier, "id">) =>
    setSuppliers(prev => [...prev, { ...data, id: uid() }])

  const updateSupplier = (id: string, data: Partial<Supplier>) =>
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))

  const deleteSupplier = (id: string) =>
    setSuppliers(prev => prev.filter(s => s.id !== id))

  return (
    <SuppliersContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliers() {
  const ctx = useContext(SuppliersContext)
  if (!ctx) throw new Error("useSuppliers must be inside SuppliersProvider")
  return ctx
}
