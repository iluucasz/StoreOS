"use client"

import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"
import { AppSidebar, MobileNav } from "@/components/app-sidebar"
import { SettingsMenu } from "@/components/settings-menu"
import { NotificationsBell } from "@/components/notifications-bell"
import { UserMenu, type HeaderUser } from "@/components/user-menu"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

function Shell({ children, user }: { children: ReactNode; user: HeaderUser }) {
  const { collapsed } = useSidebar()

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className={cn(
        "flex-1 min-w-0 flex flex-col transition-all duration-200",
        collapsed ? "md:pl-16" : "md:pl-64"
      )}>
        {/* Mobile header */}
        <header className="md:hidden flex items-center h-16 px-3 border-b bg-background sticky top-0 z-10 gap-3 shrink-0">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2 font-bold flex-1">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-base tracking-tight">StoreOS</span>
          </Link>
          <NotificationsBell />
          <UserMenu user={user} />
        </header>
        {/* Desktop header — aligns with sidebar h-16 */}
        <header className="hidden md:flex items-center justify-end gap-3 h-16 px-4 border-b bg-background sticky top-0 z-10 shrink-0">
          <NotificationsBell />
          <UserMenu user={user} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
      <SettingsMenu />
    </div>
  )
}

export function LayoutShell({ children, user }: { children: ReactNode; user: HeaderUser }) {
  return (
    <SidebarProvider>
      <Shell user={user}>{children}</Shell>
    </SidebarProvider>
  )
}
