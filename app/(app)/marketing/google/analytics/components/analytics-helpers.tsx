"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

/** Busca dados de uma rota da GA4 quando conectado, com loading/erro. */
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
      .then((r) => r.json())
      .then((json) => {
        if (!active) return
        if (json.error) setError(json.error)
        else setData(json)
      })
      .catch(() => active && setError("Falha ao carregar dados do Google Analytics"))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [path, isConnected])

  return { data, loading, error }
}

export function NotConnected() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conecte-se ao Google Analytics</CardTitle>
        <CardDescription>
          Configure a integração na aba “Integração” para visualizar os dados reais do seu GA4.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-center text-muted-foreground">
          Você precisa conectar sua conta do Google Analytics para visualizar esses dados.
        </p>
      </CardContent>
    </Card>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin mr-2" />
      Carregando dados do Google Analytics...
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
