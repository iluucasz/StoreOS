import type React from "react"
// Simplified version of the toast hook
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, action, variant }: ToastProps) => {
  return sonnerToast(title, {
    description,
    action,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  })
}
