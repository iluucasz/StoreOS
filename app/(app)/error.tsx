"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/feedback-state"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <ErrorState
        title="Não foi possível abrir esta tela"
        description="A requisição falhou ou retornou uma resposta inesperada."
        actionLabel="Tentar de novo"
        onAction={reset}
        className="min-h-72"
      />
    </div>
  )
}
