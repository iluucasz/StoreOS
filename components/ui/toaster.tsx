"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        className: "border border-border bg-background text-foreground",
        duration: 3000,
      }}
    />
  )
}
