"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  listPromotions,
  createPromotion,
  updatePromotionAction,
  deletePromotionAction,
} from "@/app/actions/promotions"

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
  loading: boolean
  addPromotion: (p: Omit<Promotion, "id" | "usageCount">) => void
  updatePromotion: (id: string, data: Partial<Promotion>) => void
  deletePromotion: (id: string) => void
}

const PromotionsContext = createContext<PromotionsContextValue | null>(null)

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPromotions()
      .then(setPromotions)
      .finally(() => setLoading(false))
  }, [])

  const addPromotion = (data: Omit<Promotion, "id" | "usageCount">) => {
    createPromotion(data).then(setPromotions)
  }

  const updatePromotion = (id: string, data: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
    updatePromotionAction(id, data).then(setPromotions)
  }

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id))
    deletePromotionAction(id).then(setPromotions)
  }

  return (
    <PromotionsContext.Provider value={{ promotions, loading, addPromotion, updatePromotion, deletePromotion }}>
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext)
  if (!ctx) throw new Error("usePromotions must be inside PromotionsProvider")
  return ctx
}
