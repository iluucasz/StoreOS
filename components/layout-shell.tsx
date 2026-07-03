"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Search, TrendingUp } from "lucide-react"
import { AppSidebar, MobileNav } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationsBell } from "@/components/notifications-bell"
import { SettingsMenu } from "@/components/settings-menu"
import { UserMenu, type HeaderUser } from "@/components/user-menu"
import { Input } from "@/components/ui/input"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"

function Shell({ children, user }: { children: ReactNode; user: HeaderUser }) {
  const { collapsed } = useSidebar()

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-200",
          collapsed ? "md:pl-16" : "md:pl-64",
        )}
      >
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur md:hidden">
          <MobileNav />
          <Link href="/" className="flex flex-1 items-center gap-2 font-bold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-base tracking-tight">StoreOS</span>
          </Link>
          <ModeToggle />
          <NotificationsBell />
          <UserMenu user={user} />
        </header>

        <header className="sticky top-0 z-10 hidden h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/85 px-5 backdrop-blur md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos, produtos ou campanhas..."
              className="h-9 bg-card/80 pl-9 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <ModeToggle />
            <NotificationsBell />
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
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
