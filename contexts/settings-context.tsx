"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface Settings {
  // Precificação
  shippingCost: number
  marketingBudget: number
  packagingCost: number
  paymentFeePercentage: number
  expectedMonthlySales: number

  // Perfil da Loja
  storeName: string
  storeCNPJ: string
  storeEmail: string

  // Integrações
  shopifyStoreUrl: string
  shopifyAccessToken: string
  whatsappPhoneNumber: string
  whatsappApiKey: string

  // Alertas
  lowStockThreshold: number
  maxCACAlert: number
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  shippingCost: 30,
  marketingBudget: 300,
  packagingCost: 0.6,
  paymentFeePercentage: 5,
  expectedMonthlySales: 50,

  storeName: "",
  storeCNPJ: "",
  storeEmail: "",

  shopifyStoreUrl: "",
  shopifyAccessToken: "",
  whatsappPhoneNumber: "",
  whatsappApiKey: "",

  lowStockThreshold: 5,
  maxCACAlert: 50,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pricingSettings")
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) }
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem("pricingSettings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
