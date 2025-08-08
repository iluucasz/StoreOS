"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calculator,
  LineChart,
  Tag,
  TrendingUp,
  Package,
  BarChart2,
  HelpCircle,
  Settings,
  Facebook,
  Activity,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const navigation = [
  { name: "Dashboard", href: "/", icon: TrendingUp },
  { name: "Calculadora", href: "/calculator", icon: Calculator },
  { name: "Simulador", href: "/simulator", icon: LineChart },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Preços", href: "/pricing", icon: Tag },
  { name: "Relatórios", href: "/reports", icon: BarChart2 },
]

const marketingItems = [
  { name: "Dashboard", href: "/marketing", icon: BarChart2 },
  { name: "Facebook Ads", href: "/marketing/facebook", icon: Facebook },
  { name: "Google Ads", href: "/marketing/google/ads", icon: BarChart2 },
  { name: "Google Analytics", href: "/marketing/google/analytics", icon: Activity },
]

const bottomNavigation = [
  { name: "Ajuda", href: "/help", icon: HelpCircle },
  { name: "Configurações", href: "#", icon: Settings, isSettings: true },
]

export function AppSidebar() {
  const pathname = usePathname()

  // Determinar se o accordion de marketing deve estar aberto com base no pathname atual
  const isMarketingOpen = pathname.startsWith("/marketing") ? "marketing" : undefined

  return (
    <div className="fixed inset-y-0 z-20 flex flex-col bg-background border-r border-border w-64">
      <div className="border-b border-border">
        <div className="flex h-16 items-center gap-2 px-4">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-lg">Precificador</span>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
              )}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Marketing Accordion */}
          <Accordion type="single" collapsible defaultValue={isMarketingOpen} className="w-full">
            <AccordionItem value="marketing" className="border-none">
              <AccordionTrigger
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                  pathname.startsWith("/marketing") && !marketingItems.some((item) => pathname === item.href)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-3" />
                  <span>Marketing</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0">
                <div className="ml-6 space-y-1">
                  {marketingItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
      </div>
      <div className="border-t border-border p-2">
        <nav className="space-y-1">
          {bottomNavigation.map((item) =>
            item.isSettings ? (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start px-3 py-2"
                onClick={() => {
                  // Abrir modal de configurações
                  document.getElementById("settings-trigger")?.click()
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.name}</span>
              </Button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.name}</span>
              </Link>
            ),
          )}
        </nav>
      </div>
    </div>
  )
}
