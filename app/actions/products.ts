"use server"

import { eq, and, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { products, productVariants } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface VariantDTO { id: string; size: string; color: string; stock: number }
export interface ProductDTO {
  id: number
  name: string
  cost: number
  price: number
  margin: number
  stock: number
  variants: VariantDTO[]
  createdAt: string // ISO
}

async function loadProducts(userId: string): Promise<ProductDTO[]> {
  const rows = await db.select().from(products).where(eq(products.userId, userId))
  if (rows.length === 0) return []
  const ids = rows.map((r) => r.id)
  const variants = await db.select().from(productVariants).where(inArray(productVariants.productId, ids))

  return rows
    .map((p) => ({
      id: p.id,
      name: p.name,
      cost: Number(p.cost),
      price: Number(p.price),
      margin: Number(p.margin),
      stock: p.stock,
      createdAt: p.createdAt.toISOString(),
      variants: variants
        .filter((v) => v.productId === p.id)
        .map((v) => ({ id: String(v.id), size: v.size, color: v.color, stock: v.stock })),
    }))
    .sort((a, b) => a.id - b.id)
}

export async function listProducts(): Promise<ProductDTO[]> {
  const u = await requireUser()
  return loadProducts(u.id)
}

export async function createProduct(input: Omit<ProductDTO, "id" | "createdAt">): Promise<ProductDTO[]> {
  const u = await requireUser()
  const [row] = await db.insert(products).values({
    userId: u.id,
    name: input.name,
    cost: String(input.cost),
    price: String(input.price),
    margin: String(input.margin),
    stock: input.stock,
  }).returning({ id: products.id })

  if (input.variants?.length) {
    await db.insert(productVariants).values(
      input.variants.map((v) => ({ productId: row.id, size: v.size, color: v.color, stock: v.stock }))
    )
  }
  return loadProducts(u.id)
}

export async function updateProductAction(input: ProductDTO): Promise<ProductDTO[]> {
  const u = await requireUser()
  // ownership check
  const owned = await db.select({ id: products.id }).from(products)
    .where(and(eq(products.id, input.id), eq(products.userId, u.id))).limit(1)
  if (!owned[0]) return loadProducts(u.id)

  await db.update(products).set({
    name: input.name,
    cost: String(input.cost),
    price: String(input.price),
    margin: String(input.margin),
    stock: input.stock,
  }).where(eq(products.id, input.id))

  // Replace variants: delete existing, re-insert
  await db.delete(productVariants).where(eq(productVariants.productId, input.id))
  if (input.variants?.length) {
    await db.insert(productVariants).values(
      input.variants.map((v) => ({ productId: input.id, size: v.size, color: v.color, stock: v.stock }))
    )
  }
  return loadProducts(u.id)
}

export async function deleteProductAction(id: number): Promise<ProductDTO[]> {
  const u = await requireUser()
  await db.delete(products).where(and(eq(products.id, id), eq(products.userId, u.id)))
  return loadProducts(u.id)
}
