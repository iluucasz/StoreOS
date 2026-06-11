"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"

export interface NotificationDTO {
  id: string
  type: "estoque" | "financeiro" | "pedido" | "meta" | "marketing"
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  createdAt: string
  read: boolean
  href?: string
}

async function load(userId: string): Promise<NotificationDTO[]> {
  const rows = await db.select().from(notifications).where(eq(notifications.userId, userId))
  return rows
    .map((n) => ({
      id: String(n.id),
      type: n.type,
      severity: n.severity,
      title: n.title,
      description: n.description,
      createdAt: n.createdAt.toISOString(),
      read: n.read,
      href: n.href ?? undefined,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function listNotifications(): Promise<NotificationDTO[]> {
  const u = await requireUser()
  return load(u.id)
}

export async function markNotificationRead(id: string): Promise<NotificationDTO[]> {
  const u = await requireUser()
  await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, Number(id)), eq(notifications.userId, u.id)))
  return load(u.id)
}

export async function markAllNotificationsRead(): Promise<NotificationDTO[]> {
  const u = await requireUser()
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, u.id))
  return load(u.id)
}

export async function dismissNotification(id: string): Promise<NotificationDTO[]> {
  const u = await requireUser()
  await db.delete(notifications).where(and(eq(notifications.id, Number(id)), eq(notifications.userId, u.id)))
  return load(u.id)
}
