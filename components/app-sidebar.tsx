"use client"

import type { ElementType } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BarChart2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  HelpCircle,
  LayoutGrid,
  Menu,
  MessageCircle,
  Package,
  RefreshCw,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
} from "lucide-react"
import { MetaIcon, TikTokIcon } from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"

type NavItem = { name: string; href: string; icon: ElementType }
type NavGroup = { key: string; label: string; icon: ElementType; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    key: "operacao",
    label: "Operação",
    icon: ShoppingCart,
    items: [
      { name: "Pedidos", href: "/orders", icon: ShoppingCart },
      { name: "Estoque", href: "/inventory", icon: Warehouse },
      { name: "Produtos", href: "/products", icon: Package },
      { name: "Precificação", href: "/calculator", icon: Calculator },
      { name: "Fornecedores", href: "/suppliers", icon: Truck },
    ],
  },
  {
    key: "vendas",
    label: "Vendas",
    icon: Tag,
    items: [
      { name: "Promoções", href: "/promotions", icon: Tag },
      { name: "CRM", href: "/crm", icon: Users },
    ],
  },
  {
    key: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    items: [
      { name: "Relatórios", href: "/reports", icon: DollarSign },
      { name: "Metas", href: "/goals", icon: Target },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: BarChart2,
    items: [
      { name: "Visão Geral", href: "/marketing", icon: BarChart2 },
      { name: "Meta Ads", href: "/marketing/facebook", icon: MetaIcon },
      { name: "TikTok Ads", href: "/marketing/tiktok", icon: TikTokIcon },
      { name: "Google Ads", href: "/marketing/google/ads", icon: BarChart2 },
      { name: "Analytics", href: "/marketing/google/analytics", icon: Activity },
      { name: "Retenção", href: "/marketing/retention", icon: RefreshCw },
      { name: "IA", href: "/ia", icon: Sparkles },
    ],
  },
  {
    key: "integracoes",
    label: "Integrações",
    icon: LayoutGrid,
    items: [
      { name: "Hub", href: "/integrations", icon: LayoutGrid },
      { name: "Shopify", href: "/integrations/shopify", icon: ShoppingBag },
      { name: "WhatsApp", href: "/integrations/whatsapp", icon: MessageCircle },
    ],
  },
]

const bottomNavigation = [
  { name: "Ajuda", href: "/help", icon: HelpCircle },
  { name: "Configurações", href: "#", icon: Settings, isSettings: true },
]

function isActiveHref(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const active = isActiveHref(pathname, item.href)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <item.icon className="mr-3 h-4 w-4 shrink-0" />
      <span>{item.name}</span>
    </Link>
  )
}

function IconLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActiveHref(pathname, item.href)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
            active
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {item.name}
      </TooltipContent>
    </Tooltip>
  )
}

function CollapsedDivider() {
  return <div className="mx-auto my-2 h-px w-6 bg-sidebar-border" />
}

function ExpandedNav({ onNavigate, onToggle }: { onNavigate?: () => void; onToggle?: () => void }) {
  const pathname = usePathname()
  const defaultOpen = navGroups.map((group) => group.key)

  return (
    <>
      <div className="shrink-0 border-b border-sidebar-border">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold" onClick={onNavigate}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
              <TrendingUp className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg tracking-tight">StoreOS</span>
          </Link>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-0.5 px-2">
          <NavLink item={{ name: "Dashboard", href: "/", icon: TrendingUp }} pathname={pathname} onClick={onNavigate} />

          <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
            {navGroups.map((group) => {
              const isGroupActive = group.items.some((item) => isActiveHref(pathname, item.href))

              return (
                <AccordionItem key={group.key} value={group.key} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:no-underline [&>svg]:ml-auto [&>svg]:shrink-0",
                      isGroupActive
                        ? "text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      <group.icon className="mr-3 h-4 w-4 shrink-0" />
                      <span>{group.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-0.5">
                    <div className="mb-1 ml-4 space-y-0.5 border-l border-sidebar-border/70 pl-3">
                      {group.items.map((item) => (
                        <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </nav>
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-2">
        <nav className="space-y-0.5">
          {bottomNavigation.map((item) =>
            item.isSettings ? (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => {
                  onNavigate?.()
                  document.getElementById("settings-trigger")?.click()
                }}
              >
                <item.icon className="mr-3 h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Button>
            ) : (
              <NavLink key={item.name} item={item} pathname={pathname} onClick={onNavigate} />
            ),
          )}
        </nav>
      </div>
    </>
  )
}

function CollapsedNav({ onToggle }: { onToggle: () => void }) {
  const pathname = usePathname()
  const allItems: NavItem[] = [{ name: "Dashboard", href: "/", icon: TrendingUp }, ...navGroups.flatMap((group) => group.items)]

  return (
    <TooltipProvider delayDuration={100}>
      <div className="shrink-0 border-b border-sidebar-border">
        <div className="flex h-16 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" className="flex items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shadow-sm">
                  <TrendingUp className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">StoreOS — Dashboard</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <div className="space-y-1">
          {allItems.map((item) => {
            const isGroupStart = navGroups.some((group) => group.items[0].href === item.href)

            return (
              <div key={item.href}>
                {isGroupStart && <CollapsedDivider />}
                <IconLink item={item} pathname={pathname} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 space-y-1 border-t border-sidebar-border py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto flex h-10 w-10 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={onToggle}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Expandir sidebar</TooltipContent>
        </Tooltip>

        {bottomNavigation.map((item) =>
          item.isSettings ? (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto flex h-10 w-10 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => document.getElementById("settings-trigger")?.click()}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          ),
        )}
      </div>
    </TooltipProvider>
  )
}

export function AppSidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-20 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {collapsed ? <CollapsedNav onToggle={toggle} /> : <ExpandedNav onToggle={toggle} />}
    </div>
  )
}

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 border-sidebar-border p-0">
        <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
          <ExpandedNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
