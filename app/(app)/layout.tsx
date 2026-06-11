import { SettingsProvider } from "@/contexts/settings-context"
import { ProductsProvider } from "@/contexts/products-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { GoalsProvider } from "@/contexts/goals-context"
import { SuppliersProvider } from "@/contexts/suppliers-context"
import { PromotionsProvider } from "@/contexts/promotions-context"
import { StockEntriesProvider } from "@/contexts/stock-entries-context"
import { CRMProvider } from "@/contexts/crm-context"
import { LayoutShell } from "@/components/layout-shell"
import { requireUser } from "@/lib/auth"
import type React from "react"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <SettingsProvider>
      <ProductsProvider>
        <NotificationsProvider>
          <GoalsProvider>
            <SuppliersProvider>
              <PromotionsProvider>
                <StockEntriesProvider>
                  <CRMProvider>
                    <LayoutShell user={user}>{children}</LayoutShell>
                  </CRMProvider>
                </StockEntriesProvider>
              </PromotionsProvider>
            </SuppliersProvider>
          </GoalsProvider>
        </NotificationsProvider>
      </ProductsProvider>
    </SettingsProvider>
  )
}
