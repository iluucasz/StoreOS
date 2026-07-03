"use client"

import type { LucideIcon } from "lucide-react"
import { AlertCircle, Loader2, PlugZap, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FeedbackStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: FeedbackStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/25 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm ring-1 ring-border">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {actionLabel && onAction && (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title = "Não foi possível carregar",
  description = "Tente novamente em alguns instantes.",
  actionLabel = "Tentar novamente",
  onAction,
  className,
}: Partial<FeedbackStateProps>) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 px-6 py-8 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-background text-destructive shadow-sm ring-1 ring-destructive/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-destructive">{title}</h3>
      {description && <p className="mt-1 max-w-lg text-sm text-muted-foreground">{description}</p>}
      {onAction && (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function LoadingState({ label = "Carregando dados...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-40 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground", className)}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {label}
    </div>
  )
}

export function IntegrationRequired({
  service,
  description,
  actionLabel,
  onAction,
  className,
}: {
  service: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={PlugZap}
      title={`Conecte ${service}`}
      description={description ?? `Finalize a integração com ${service} para visualizar estes dados.`}
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
    />
  )
}
