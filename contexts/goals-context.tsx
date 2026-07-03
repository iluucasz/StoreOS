"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { listGoals, updateGoalTargetAction, updateGoalCurrentAction } from "@/app/actions/goals"

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
  loading: boolean
  updateTarget: (id: string, target: number) => void
  updateCurrent: (id: string, current: number) => void
}

const GoalsContext = createContext<GoalsContextValue | null>(null)

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listGoals()
      .then(setGoals)
      .catch((error) => {
        console.error("Failed to load goals:", error)
        setGoals([])
      })
      .finally(() => setLoading(false))
  }, [])

  const updateTarget = (id: string, target: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, target } : g)))
    updateGoalTargetAction(id, target).then(setGoals).catch((error) => console.error("Failed to update goal target:", error))
  }

  const updateCurrent = (id: string, current: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current } : g)))
    updateGoalCurrentAction(id, current).then(setGoals).catch((error) => console.error("Failed to update goal current:", error))
  }

  return (
    <GoalsContext.Provider value={{ goals, loading, updateTarget, updateCurrent }}>
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const ctx = useContext(GoalsContext)
  if (!ctx) throw new Error("useGoals must be inside GoalsProvider")
  return ctx
}
