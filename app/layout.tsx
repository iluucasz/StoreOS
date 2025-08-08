import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/contexts/settings-context"
import { ProductsProvider } from "@/contexts/products-context"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { SettingsMenu } from "@/components/settings-menu"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Precificador de Produtos",
  description: "Calculadora de precificação e marketing para loja WooCommerce",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <ProductsProvider>
              <div className="flex h-screen bg-background">
                <AppSidebar />
                <div className="flex-1 pl-64">
                  <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
                </div>
                <SettingsMenu />
              </div>
              <Toaster />
            </ProductsProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
