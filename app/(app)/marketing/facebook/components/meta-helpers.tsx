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

export function useMetaData<T>(path: string, isConnected: boolean) {
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
        if (!response.ok || json.error) setError(json.error || "Não foi possível carregar dados da Meta.")
        else setData(json)
      })
      .catch(() => active && setError("Não foi possível conectar à Meta agora."))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [path, isConnected])

  return { data, loading, error }
}

export function NotConnected({ what }: { what: string }) {
  return (
    <IntegrationRequired
      service="Meta Ads"
      description={`Configure a integração para visualizar ${what}.`}
    />
  )
}

export function LoadingStateMeta() {
  return <BaseLoadingState label="Carregando dados da Meta..." />
}

export { LoadingStateMeta as LoadingState }

export function ErrorStateMeta({ message }: { message: string }) {
  return <BaseErrorState description={message} />
}

export { ErrorStateMeta as ErrorState }
