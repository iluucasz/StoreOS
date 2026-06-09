import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/contexts/settings-context"
import { ProductsProvider } from "@/contexts/products-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { GoalsProvider } from "@/contexts/goals-context"
import { SuppliersProvider } from "@/contexts/suppliers-context"
import { PromotionsProvider } from "@/contexts/promotions-context"
import { StockEntriesProvider } from "@/contexts/stock-entries-context"
import { Toaster } from "@/components/ui/toaster"
import { LayoutShell } from "@/components/layout-shell"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StoreOS",
  description: "Uma única tela que centraliza tudo: produtos, financeiro, precificação e marketing.",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <ProductsProvider>
              <NotificationsProvider>
                <GoalsProvider>
                  <SuppliersProvider>
                    <PromotionsProvider>
                      <StockEntriesProvider>
                        <LayoutShell>{children}</LayoutShell>
                        <Toaster />
                      </StockEntriesProvider>
                    </PromotionsProvider>
                  </SuppliersProvider>
                </GoalsProvider>
              </NotificationsProvider>
            </ProductsProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
