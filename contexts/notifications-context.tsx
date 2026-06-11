"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "@/app/actions/notifications"

export type NotificationType = "estoque" | "financeiro" | "pedido" | "meta" | "marketing"
export type NotificationSeverity = "critical" | "warning" | "info"

export interface Notification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  description: string
  createdAt: string
  read: boolean
  href?: string
}

interface NotificationsContextValue {
  notifications: Notification[]
  loading: boolean
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismiss: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    markNotificationRead(id).then(setNotifications)
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().then(setNotifications)
  }

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    dismissNotification(id).then(setNotifications)
  }

  return (
    <NotificationsContext.Provider value={{ notifications, loading, unreadCount, markAsRead, markAllAsRead, dismiss }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be inside NotificationsProvider")
  return ctx
}
