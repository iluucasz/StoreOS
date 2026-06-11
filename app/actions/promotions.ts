"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { promotions } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface PromotionDTO {
  id: string
  code: string
  description: string
  type: "percentual" | "fixo" | "frete_gratis"
  value: number
  minOrderValue: number
  usageLimit: number | null
  usageCount: number
  validFrom: string
  validTo: string
  status: "ativo" | "agendado" | "expirado" | "inativo"
}

async function load(userId: string): Promise<PromotionDTO[]> {
  const rows = await db.select().from(promotions).where(eq(promotions.userId, userId))
  return rows
    .map((p) => ({
      id: String(p.id),
      code: p.code,
      description: p.description,
      type: p.type,
      value: Number(p.value),
      minOrderValue: Number(p.minOrderValue),
      usageLimit: p.usageLimit,
      usageCount: p.usageCount,
      validFrom: p.validFrom,
      validTo: p.validTo,
      status: p.status,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id))
}

export async function listPromotions(): Promise<PromotionDTO[]> {
  const u = await requireUser()
  return load(u.id)
}

export async function createPromotion(input: Omit<PromotionDTO, "id" | "usageCount">): Promise<PromotionDTO[]> {
  const u = await requireUser()
  await db.insert(promotions).values({
    userId: u.id,
    code: input.code,
    description: input.description,
    type: input.type,
    value: String(input.value),
    minOrderValue: String(input.minOrderValue),
    usageLimit: input.usageLimit,
    usageCount: 0,
    validFrom: input.validFrom,
    validTo: input.validTo,
    status: input.status,
  })
  return load(u.id)
}

export async function updatePromotionAction(id: string, data: Partial<PromotionDTO>): Promise<PromotionDTO[]> {
  const u = await requireUser()
  const patch: Record<string, unknown> = {}
  if (data.code !== undefined) patch.code = data.code
  if (data.description !== undefined) patch.description = data.description
  if (data.type !== undefined) patch.type = data.type
  if (data.value !== undefined) patch.value = String(data.value)
  if (data.minOrderValue !== undefined) patch.minOrderValue = String(data.minOrderValue)
  if (data.usageLimit !== undefined) patch.usageLimit = data.usageLimit
  if (data.usageCount !== undefined) patch.usageCount = data.usageCount
  if (data.validFrom !== undefined) patch.validFrom = data.validFrom
  if (data.validTo !== undefined) patch.validTo = data.validTo
  if (data.status !== undefined) patch.status = data.status

  if (Object.keys(patch).length > 0) {
    await db.update(promotions).set(patch).where(and(eq(promotions.id, Number(id)), eq(promotions.userId, u.id)))
  }
  return load(u.id)
}

export async function deletePromotionAction(id: string): Promise<PromotionDTO[]> {
  const u = await requireUser()
  await db.delete(promotions).where(and(eq(promotions.id, Number(id)), eq(promotions.userId, u.id)))
  return load(u.id)
}
