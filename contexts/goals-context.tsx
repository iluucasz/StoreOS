"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type GoalMetric = "receita" | "pedidos" | "cpa" | "margem" | "novosClientes"
export type GoalUnit = "currency" | "number" | "percent"

export interface Goal {
  id: string
  metric: GoalMetric
  label: string
  target: number
  current: number
  unit: GoalUnit
  lowerIsBetter?: boolean
}

interface GoalsContextValue {
  goals: Goal[]
  updateTarget: (id: string, target: number) => void
  updateCurrent: (id: string, current: number) => void
}

const defaultGoals: Goal[] = [
  { id: "receita", metric: "receita", label: "Receita Mensal", target: 30000, current: 26500, unit: "currency" },
  { id: "pedidos", metric: "pedidos", label: "Pedidos no Mês", target: 50, current: 32, unit: "number" },
  { id: "cpa", metric: "cpa", label: "CPA Máximo", target: 15, current: 12.5, unit: "currency", lowerIsBetter: true },
  { id: "margem", metric: "margem", label: "Margem Média", target: 75, current: 74.3, unit: "percent" },
  { id: "novosClientes", metric: "novosClientes", label: "Novos Clientes", target: 40, current: 29, unit: "number" },
]

const GoalsContext = createContext<GoalsContextValue | null>(null)

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("storeosGoals")
      if (saved) return JSON.parse(saved)
    }
    return defaultGoals
  })

  useEffect(() => {
    localStorage.setItem("storeosGoals", JSON.stringify(goals))
  }, [goals])

  const updateTarget = (id: string, target: number) =>
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, target } : g)))

  const updateCurrent = (id: string, current: number) =>
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current } : g)))

  return (
    <GoalsContext.Provider value={{ goals, updateTarget, updateCurrent }}>
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const ctx = useContext(GoalsContext)
  if (!ctx) throw new Error("useGoals must be inside GoalsProvider")
  return ctx
}
