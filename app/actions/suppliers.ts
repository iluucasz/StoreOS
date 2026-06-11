"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { suppliers } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface SupplierDTO {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  category: "Vestuário" | "Embalagem" | "Logística" | "Tecnologia" | "Outros"
  leadTimeDays: number
  minOrderValue: number
  totalPurchased: number
  lastOrderDate: string
  status: "ativo" | "inativo" | "em_avaliacao"
  notes: string
}

async function load(userId: string): Promise<SupplierDTO[]> {
  const rows = await db.select().from(suppliers).where(eq(suppliers.userId, userId))
  return rows
    .map((s) => ({
      id: String(s.id),
      name: s.name,
      contact: s.contact,
      phone: s.phone,
      email: s.email,
      category: s.category,
      leadTimeDays: s.leadTimeDays,
      minOrderValue: Number(s.minOrderValue),
      totalPurchased: Number(s.totalPurchased),
      lastOrderDate: s.lastOrderDate ?? "",
      status: s.status,
      notes: s.notes,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id))
}

export async function listSuppliers(): Promise<SupplierDTO[]> {
  const u = await requireUser()
  return load(u.id)
}

export async function createSupplier(input: Omit<SupplierDTO, "id">): Promise<SupplierDTO[]> {
  const u = await requireUser()
  await db.insert(suppliers).values({
    userId: u.id,
    name: input.name,
    contact: input.contact,
    phone: input.phone,
    email: input.email,
    category: input.category,
    leadTimeDays: input.leadTimeDays,
    minOrderValue: String(input.minOrderValue),
    totalPurchased: String(input.totalPurchased),
    lastOrderDate: input.lastOrderDate || null,
    status: input.status,
    notes: input.notes,
  })
  return load(u.id)
}

export async function updateSupplierAction(id: string, data: Partial<SupplierDTO>): Promise<SupplierDTO[]> {
  const u = await requireUser()
  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.contact !== undefined) patch.contact = data.contact
  if (data.phone !== undefined) patch.phone = data.phone
  if (data.email !== undefined) patch.email = data.email
  if (data.category !== undefined) patch.category = data.category
  if (data.leadTimeDays !== undefined) patch.leadTimeDays = data.leadTimeDays
  if (data.minOrderValue !== undefined) patch.minOrderValue = String(data.minOrderValue)
  if (data.totalPurchased !== undefined) patch.totalPurchased = String(data.totalPurchased)
  if (data.lastOrderDate !== undefined) patch.lastOrderDate = data.lastOrderDate || null
  if (data.status !== undefined) patch.status = data.status
  if (data.notes !== undefined) patch.notes = data.notes

  if (Object.keys(patch).length > 0) {
    await db.update(suppliers).set(patch).where(and(eq(suppliers.id, Number(id)), eq(suppliers.userId, u.id)))
  }
  return load(u.id)
}

export async function deleteSupplierAction(id: string): Promise<SupplierDTO[]> {
  const u = await requireUser()
  await db.delete(suppliers).where(and(eq(suppliers.id, Number(id)), eq(suppliers.userId, u.id)))
  return load(u.id)
}
