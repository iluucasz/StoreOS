"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismiss: (id: string) => void
}

const seedNotifications: Notification[] = [
  {
    id: "n1",
    type: "estoque",
    severity: "critical",
    title: "Estoque crítico — Conjunto Verão",
    description: "Apenas 3 unidades restantes. Abaixo do limite mínimo de 5.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    href: "/inventory",
  },
  {
    id: "n2",
    type: "estoque",
    severity: "critical",
    title: "Estoque crítico — Vestido Casual",
    description: "Apenas 2 unidades restantes. Risco de ruptura.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    href: "/inventory",
  },
  {
    id: "n3",
    type: "pedido",
    severity: "warning",
    title: "Pedido #1042 pendente há 2h",
    description: "Ana Lima aguarda confirmação de pagamento.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: false,
    href: "/orders",
  },
  {
    id: "n4",
    type: "meta",
    severity: "info",
    title: "Meta de receita: 88% atingida",
    description: "R$ 26.500 de R$ 30.000. Faltam R$ 3.500 para bater a meta do mês.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    href: "/goals",
  },
  {
    id: "n5",
    type: "financeiro",
    severity: "warning",
    title: "Conta vencendo amanhã",
    description: "Google Ads — fatura Jun: R$ 2.100 vence em 09/06.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: true,
    href: "/reports",
  },
  {
    id: "n6",
    type: "estoque",
    severity: "warning",
    title: "Estoque baixo — Blusa Feminina",
    description: "8 unidades. Considere repor em breve.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    href: "/inventory",
  },
  {
    id: "n7",
    type: "marketing",
    severity: "info",
    title: "CPA abaixo da meta",
    description: "CPA atual R$ 12,50 — abaixo do limite de R$ 50. Tudo certo.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
    href: "/reports",
  },
]

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("storeosNotifications")
      if (saved) return JSON.parse(saved)
    }
    return seedNotifications
  })

  useEffect(() => {
    localStorage.setItem("storeosNotifications", JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, dismiss }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be inside NotificationsProvider")
  return ctx
}
