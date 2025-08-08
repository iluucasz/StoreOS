"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface Settings {
  shippingCost: number
  marketingBudget: number
  packagingCost: number
  paymentFeePercentage: number
  expectedMonthlySales: number
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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Try to load settings from localStorage during initialization
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("pricingSettings")
      if (savedSettings) {
        return JSON.parse(savedSettings)
      }
    }
    return defaultSettings
  })

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pricingSettings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
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
