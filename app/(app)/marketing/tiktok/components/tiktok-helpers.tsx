"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

/** Busca dados de uma rota do TikTok quando conectado, com loading/erro. */
export function useTikTokData<T>(path: string, isConnected: boolean) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true
    setLoading(true)
    setError(null)
    fetch(path)
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else setData(json)
      })
      .catch(() => active && setError("Falha ao carregar dados do TikTok"))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [path, isConnected])

  return { data, loading, error }
}

export function NotConnected({ what }: { what: string }) {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Não conectado</AlertTitle>
      <AlertDescription>Configure a integração na aba “Integração” para visualizar {what}.</AlertDescription>
    </Alert>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin mr-2" />
      Carregando dados do TikTok...
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar dados</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
