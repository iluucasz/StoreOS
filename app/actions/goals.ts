"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { goals } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface GoalDTO {
  id: string
  metric: "receita" | "pedidos" | "cpa" | "margem" | "novosClientes"
  label: string
  target: number
  current: number
  unit: "currency" | "number" | "percent"
  lowerIsBetter: boolean
}

async function load(userId: string): Promise<GoalDTO[]> {
  const rows = await db.select().from(goals).where(eq(goals.userId, userId))
  return rows
    .map((g) => ({
      id: String(g.id),
      metric: g.metric,
      label: g.label,
      target: Number(g.target),
      current: Number(g.current),
      unit: g.unit,
      lowerIsBetter: g.lowerIsBetter,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id))
}

export async function listGoals(): Promise<GoalDTO[]> {
  const u = await requireUser()
  return load(u.id)
}

export async function updateGoalTargetAction(id: string, target: number): Promise<GoalDTO[]> {
  const u = await requireUser()
  await db.update(goals).set({ target: String(target) }).where(and(eq(goals.id, Number(id)), eq(goals.userId, u.id)))
  return load(u.id)
}

export async function updateGoalCurrentAction(id: string, current: number): Promise<GoalDTO[]> {
  const u = await requireUser()
  await db.update(goals).set({ current: String(current) }).where(and(eq(goals.id, Number(id)), eq(goals.userId, u.id)))
  return load(u.id)
}
