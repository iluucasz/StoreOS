"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calculator, TrendingUp, Package, BarChart2, HelpCircle, Settings,
  Activity, DollarSign, Sparkles, Menu, ShoppingCart, Users,
  ShoppingBag, MessageCircle, RefreshCw, LayoutGrid, Warehouse, Target,
  ChevronLeft, ChevronRight, Truck, Tag,
} from "lucide-react"
import { MetaIcon, TikTokIcon } from "@/components/brand-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/contexts/sidebar-context"

// ─── Nav structure ────────────────────────────────────────────────────────────

type NavItem = { name: string; href: string; icon: React.ElementType }
type NavGroup = { key: string; label: string; icon: React.ElementType; items: NavItem[] }

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

function activeGroups(pathname: string) {
  return navGroups
    .filter(g => g.items.some(i => pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href + "/"))))
    .map(g => g.key)
}

// ─── Nav link ─────────────────────────────────────────────────────────────────

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
      )}
    >
      <item.icon className="h-4 w-4 mr-3 shrink-0" />
      <span>{item.name}</span>
    </Link>
  )
}

// ─── Collapsed icon link ──────────────────────────────────────────────────────

function IconLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-center rounded-md w-10 h-10 mx-auto transition-colors",
            active
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">{item.name}</TooltipContent>
    </Tooltip>
  )
}

function CollapsedDivider() {
  return <div className="my-2 mx-auto w-6 h-px bg-border" />
}

// ─── Expanded nav ─────────────────────────────────────────────────────────────

function ExpandedNav({ onNavigate, onToggle }: { onNavigate?: () => void; onToggle?: () => void }) {
  const pathname = usePathname()
  const defaultOpen = activeGroups(pathname)

  return (
    <>
      {/* Logo */}
      <div className="border-b border-border shrink-0">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold" onClick={onNavigate}>
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg tracking-tight">StoreOS</span>
          </Link>
          {onToggle && (
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onToggle}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-0.5">
          <NavLink
            item={{ name: "Dashboard", href: "/", icon: TrendingUp }}
            pathname={pathname}
            onClick={onNavigate}
          />

          <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
            {navGroups.map(group => {
              const isActive = group.items.some(
                i => pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href + "/"))
              )
              return (
                <AccordionItem key={group.key} value={group.key} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline w-full [&>svg]:ml-auto [&>svg]:shrink-0",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <group.icon className="h-4 w-4 mr-3 shrink-0" />
                      <span>{group.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0.5 pb-0">
                    <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5 mb-1">
                      {group.items.map(item => (
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

      {/* Bottom nav */}
      <div className="border-t border-border p-2 shrink-0">
        <nav className="space-y-0.5">
          {bottomNavigation.map(item =>
            item.isSettings ? (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => {
                  onNavigate?.()
                  document.getElementById("settings-trigger")?.click()
                }}
              >
                <item.icon className="h-4 w-4 mr-3 shrink-0" />
                <span>{item.name}</span>
              </Button>
            ) : (
              <NavLink key={item.name} item={item} pathname={pathname} onClick={onNavigate} />
            )
          )}
        </nav>
      </div>
    </>
  )
}

// ─── Collapsed nav (icons only) ───────────────────────────────────────────────

function CollapsedNav({ onToggle }: { onToggle: () => void }) {
  const pathname = usePathname()

  const allItems: NavItem[] = [
    { name: "Dashboard", href: "/", icon: TrendingUp },
    ...navGroups.flatMap(g => g.items),
  ]

  return (
    <TooltipProvider delayDuration={100}>
      <div className="border-b border-border shrink-0">
        <div className="flex h-16 items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" className="flex items-center justify-center">
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary-foreground" />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">StoreOS — Dashboard</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <div className="space-y-1">
          {allItems.map(item => {
            const isGroupStart = navGroups.some(g => g.items[0].href === item.href)
            return (
              <div key={item.href}>
                {isGroupStart && <CollapsedDivider />}
                <IconLink item={item} pathname={pathname} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border py-2 shrink-0 space-y-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="flex mx-auto h-10 w-10" onClick={onToggle}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Expandir sidebar</TooltipContent>
        </Tooltip>

        {bottomNavigation.map(item =>
          item.isSettings ? (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex mx-auto h-10 w-10 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
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
                  className="flex items-center justify-center mx-auto rounded-md w-10 h-10 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  )
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

export function AppSidebar() {
  const { collapsed, toggle } = useSidebar()
  return (
    <div className={cn(
      "hidden md:flex fixed inset-y-0 z-20 flex-col bg-background border-r border-border transition-all duration-200",
      collapsed ? "w-16" : "w-64",
    )}>
      {collapsed ? <CollapsedNav onToggle={toggle} /> : <ExpandedNav onToggle={toggle} />}
    </div>
  )
}

// ─── Mobile nav ───────────────────────────────────────────────────────────────

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
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full bg-background">
          <ExpandedNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
