"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, toggle: () => {} })

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed")
    if (saved === "true") setCollapsed(true)
  }, [])

  function toggle() {
    setCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", String(!prev))
      return !prev
    })
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
