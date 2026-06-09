"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, X, CheckCheck, Package, DollarSign, ShoppingCart, Target, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNotifications, type Notification, type NotificationType } from "@/contexts/notifications-context"
import { cn } from "@/lib/utils"

const typeIcon: Record<NotificationType, React.ElementType> = {
  estoque: Package,
  financeiro: DollarSign,
  pedido: ShoppingCart,
  meta: Target,
  marketing: BarChart2,
}

const severityDot: Record<string, string> = {
  critical: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "agora"
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function NotificationItem({ n, onRead, onDismiss }: { n: Notification; onRead: () => void; onDismiss: () => void }) {
  const router = useRouter()
  const Icon = typeIcon[n.type]

  function handleClick() {
    onRead()
    if (n.href) router.push(n.href)
  }

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors relative",
        !n.read && "bg-primary/5",
      )}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      {/* Icon */}
      <div className={cn(
        "shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center",
        n.severity === "critical" ? "bg-red-100 dark:bg-red-900/30" :
        n.severity === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30" :
        "bg-blue-100 dark:bg-blue-900/30"
      )}>
        <Icon className={cn("h-3.5 w-3.5",
          n.severity === "critical" ? "text-red-600 dark:text-red-400" :
          n.severity === "warning" ? "text-yellow-600 dark:text-yellow-400" :
          "text-blue-600 dark:text-blue-400"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm leading-tight", !n.read && "font-medium")}>{n.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Dismiss */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
        onClick={(e) => { e.stopPropagation(); onDismiss() }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export function NotificationsBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell className="h-5 w-5" />
          {mounted && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-xl" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllAsRead}>
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={() => markAsRead(n.id)}
                onDismiss={() => dismiss(n.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t px-4 py-2 text-center">
            <p className="text-xs text-muted-foreground">{notifications.length} notificações</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
