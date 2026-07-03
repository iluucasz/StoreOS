"use client"

import { useEffect, useState } from "react"
import {
  ErrorState as BaseErrorState,
  IntegrationRequired,
  LoadingState as BaseLoadingState,
} from "@/components/feedback-state"

async function readJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return { error: "Resposta inesperada do servidor." }
  }
}

export function useAnalyticsData<T>(path: string, isConnected: boolean) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)

    fetch(path)
      .then(async (response) => {
        const json = await readJson(response)
        if (!active) return
        if (!response.ok || json.error) setError(json.error || "Não foi possível carregar dados do Analytics.")
        else setData(json)
      })
      .catch(() => active && setError("Não foi possível conectar ao Google Analytics agora."))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [path, isConnected])

  return { data, loading, error }
}

export function NotConnected() {
  return (
    <IntegrationRequired
      service="Google Analytics"
      description="Conecte o GA4 para visualizar dados reais de aquisicao, engajamento e ecommerce."
    />
  )
}

export function LoadingStateAnalytics() {
  return <BaseLoadingState label="Carregando dados do Google Analytics..." />
}

export { LoadingStateAnalytics as LoadingState }

export function ErrorStateAnalytics({ message }: { message: string }) {
  return <BaseErrorState description={message} />
}

export { ErrorStateAnalytics as ErrorState }
