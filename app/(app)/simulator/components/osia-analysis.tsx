"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { ChatMarkdown } from "@/app/(app)/ia/components/chat-markdown"
import type { SimulatorData } from "./advanced-simulator"

export function OsiaAnalysis({ data, results }: { data: SimulatorData; results: any }) {
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ia/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, results }),
      })
      const json = await res.json()
      if (json.error) setError(json.error)
      else setAnalysis(json.analysis || "")
    } catch {
      setError("Falha ao analisar o cenário com a OSIA")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-primary/30 shadow-md">
      <CardHeader className="border-b bg-primary/5 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          Análise da OSIA
        </CardTitle>
        <CardDescription>A OSIA compara este cenário com os dados reais da sua loja</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {!analysis && !loading && !error && (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-sm text-muted-foreground">
              Veja se as premissas (vendas estimadas, preço e margem) batem com o seu histórico real e receba ajustes
              para tornar o cenário mais preciso.
            </p>
            <Button onClick={run} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Analisar cenário com a OSIA
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analisando o cenário com os dados reais da loja...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={run}>
              Tentar de novo
            </Button>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-3">
            <ChatMarkdown content={analysis} />
            <Button variant="outline" size="sm" className="gap-2" onClick={run}>
              <RefreshCw className="h-3.5 w-3.5" />
              Refazer análise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
