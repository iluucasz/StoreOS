"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type DiscountType = "percentual" | "fixo" | "frete_gratis"
export type PromotionStatus = "ativo" | "agendado" | "expirado" | "inativo"

export interface Promotion {
  id: string
  code: string
  description: string
  type: DiscountType
  value: number
  minOrderValue: number
  usageLimit: number | null
  usageCount: number
  validFrom: string
  validTo: string
  status: PromotionStatus
}

interface PromotionsContextValue {
  promotions: Promotion[]
  addPromotion: (p: Omit<Promotion, "id" | "usageCount">) => void
  updatePromotion: (id: string, data: Partial<Promotion>) => void
  deletePromotion: (id: string) => void
}

const seed: Promotion[] = [
  { id: "p1", code: "BEMVINDO10", description: "Desconto de boas-vindas para novos clientes", type: "percentual", value: 10, minOrderValue: 0, usageLimit: 100, usageCount: 34, validFrom: "2026-01-01", validTo: "2026-12-31", status: "ativo" },
  { id: "p2", code: "VERAO20", description: "Promoção coleção verão", type: "percentual", value: 20, minOrderValue: 150, usageLimit: 50, usageCount: 50, validFrom: "2026-01-01", validTo: "2026-03-31", status: "expirado" },
  { id: "p3", code: "FRETEGRATIS", description: "Frete grátis para pedidos acima de R$ 200", type: "frete_gratis", value: 0, minOrderValue: 200, usageLimit: null, usageCount: 89, validFrom: "2026-06-01", validTo: "2026-06-30", status: "ativo" },
  { id: "p4", code: "VIP50", description: "R$ 50 de desconto para clientes VIP", type: "fixo", value: 50, minOrderValue: 300, usageLimit: 20, usageCount: 8, validFrom: "2026-06-08", validTo: "2026-06-15", status: "ativo" },
  { id: "p5", code: "JULHO15", description: "15% off na coleção de julho", type: "percentual", value: 15, minOrderValue: 0, usageLimit: 200, usageCount: 0, validFrom: "2026-07-01", validTo: "2026-07-31", status: "agendado" },
  { id: "p6", code: "ANIVER30", description: "30% aniversário da loja", type: "percentual", value: 30, minOrderValue: 100, usageLimit: 30, usageCount: 30, validFrom: "2026-05-10", validTo: "2026-05-12", status: "expirado" },
]

const PromotionsContext = createContext<PromotionsContextValue | null>(null)

function uid() { return Math.random().toString(36).slice(2, 9) }

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("storeosPromotions")
      if (saved) return JSON.parse(saved)
    }
    return seed
  })

  useEffect(() => {
    localStorage.setItem("storeosPromotions", JSON.stringify(promotions))
  }, [promotions])

  const addPromotion = (data: Omit<Promotion, "id" | "usageCount">) =>
    setPromotions(prev => [...prev, { ...data, id: uid(), usageCount: 0 }])

  const updatePromotion = (id: string, data: Partial<Promotion>) =>
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))

  const deletePromotion = (id: string) =>
    setPromotions(prev => prev.filter(p => p.id !== id))

  return (
    <PromotionsContext.Provider value={{ promotions, addPromotion, updatePromotion, deletePromotion }}>
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext)
  if (!ctx) throw new Error("usePromotions must be inside PromotionsProvider")
  return ctx
}
