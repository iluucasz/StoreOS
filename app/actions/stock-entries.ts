"use server"

import { eq, desc, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { stockEntries, stockEntryItems } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface StockEntryItemDTO {
  productId: number
  productName: string
  variantId?: string
  variantLabel?: string
  quantity: number
  unitCost: number
}

export interface StockEntryDTO {
  id: string
  date: string
  supplierId: string
  supplierName: string
  nf?: string
  items: StockEntryItemDTO[]
  totalCost: number
  notes?: string
}

async function load(userId: string): Promise<StockEntryDTO[]> {
  const entries = await db
    .select()
    .from(stockEntries)
    .where(eq(stockEntries.userId, userId))
    .orderBy(desc(stockEntries.date), desc(stockEntries.id))

  if (entries.length === 0) return []

  const items = await db
    .select()
    .from(stockEntryItems)
    .where(inArray(stockEntryItems.entryId, entries.map((e) => e.id)))

  const byEntry = new Map<number, StockEntryItemDTO[]>()
  for (const it of items) {
    const arr = byEntry.get(it.entryId) ?? []
    arr.push({
      productId: it.productId ?? 0,
      productName: it.productName,
      variantId: it.variantId != null ? String(it.variantId) : undefined,
      variantLabel: it.variantLabel ?? undefined,
      quantity: it.quantity,
      unitCost: Number(it.unitCost),
    })
    byEntry.set(it.entryId, arr)
  }

  return entries.map((e) => ({
    id: String(e.id),
    date: e.date,
    supplierId: e.supplierId != null ? String(e.supplierId) : "",
    supplierName: e.supplierName,
    nf: e.nf ?? undefined,
    items: byEntry.get(e.id) ?? [],
    totalCost: Number(e.totalCost),
    notes: e.notes ?? undefined,
  }))
}

export async function listStockEntries(): Promise<StockEntryDTO[]> {
  const u = await requireUser()
  return load(u.id)
}

export async function createStockEntry(input: Omit<StockEntryDTO, "id">): Promise<StockEntryDTO[]> {
  const u = await requireUser()
  const sid = Number(input.supplierId)

  const [entry] = await db
    .insert(stockEntries)
    .values({
      userId: u.id,
      date: input.date,
      supplierId: Number.isInteger(sid) ? sid : null,
      supplierName: input.supplierName,
      nf: input.nf || null,
      totalCost: String(input.totalCost),
      notes: input.notes || null,
    })
    .returning({ id: stockEntries.id })

  if (input.items.length > 0) {
    await db.insert(stockEntryItems).values(
      input.items.map((it) => ({
        entryId: entry.id,
        productId: Number.isInteger(it.productId) ? it.productId : null,
        productName: it.productName,
        variantLabel: it.variantLabel || null,
        quantity: it.quantity,
        unitCost: String(it.unitCost),
      })),
    )
  }

  return load(u.id)
}
