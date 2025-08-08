"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calculator,
  LineChart,
  SettingsIcon,
  ShoppingBag,
  Tag,
  TrendingUp,
  Package,
  BarChart2,
  Menu,
  ChevronLeft,
  BarChart4,
  Facebook,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SettingsMenu } from "@/components/settings-menu"

// Atualizar as rotas para usar caminhos dedicados em vez de parâmetros de consulta
const navigation = [
  { name: "Dashboard", href: "/", icon: TrendingUp },
  { name: "Calculadora", href: "/calculator", icon: Calculator },
  { name: "Simulador", href: "/simulator", icon: LineChart },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Vendas", href: "/sales", icon: ShoppingBag },
  { name: "Preços", href: "/pricing", icon: Tag },
  { name: "Relatórios", href: "/reports", icon: BarChart2 },
  { name: "Marketing", href: "/marketing", icon: Activity },
  { name: "Facebook Ads", href: "/facebook-ads", icon: Facebook },
  { name: "Google Ads", href: "/google-ads", icon: BarChart4 },
]

const bottomNavigation = [{ name: "Opções", href: "#", icon: SettingsIcon }]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const NavItem = ({ item, isBottom = false }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        pathname === item.href
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
        isCollapsed && "justify-center px-2",
      )}
      onClick={() => setIsMobileOpen(false)}
    >
      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  )

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div
        className={cn(
          "fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:static",
          isCollapsed ? "w-[72px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="border-b border-border">
          <div className={cn("flex h-16 items-center gap-2 px-4", isCollapsed && "justify-center px-2")}>
            {!isCollapsed && (
              <Link href="/" className="flex items-center font-semibold">
                <span className="text-lg">Precificador</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
              <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-2">
          <nav className="space-y-1">
            {bottomNavigation.map((item) => (
              <SettingsMenu key={item.name} />
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
