"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Info, AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsStatus } from "../page"

interface AnalyticsIntegrationProps {
  status: AnalyticsStatus
  onRecheck: () => void
}

const ENV_VARS: { name: string; description: string }[] = [
  { name: "GOOGLE_ANALYTICS_PROPERTY_ID", description: "ID numérico da propriedade GA4 (Admin → Configurações da propriedade)" },
  { name: "GOOGLE_ANALYTICS_REFRESH_TOKEN", description: "Gerado pelo botão abaixo (fluxo OAuth)" },
  { name: "GOOGLE_ADS_CLIENT_ID", description: "Reutiliza o OAuth client do Google Ads (mesmo projeto)" },
  { name: "GOOGLE_ADS_CLIENT_SECRET", description: "Reutiliza o OAuth client do Google Ads" },
]

export function AnalyticsIntegration({ status, onRecheck }: AnalyticsIntegrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Status da Integração</span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Estado atual da conexão com a Google Analytics Data API (GA4)</CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Verificando conexão...
            </p>
          ) : status.connected ? (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Conectado</AlertTitle>
              <AlertDescription className="text-green-700">
                Sua propriedade do Google Analytics 4 está conectada e sincronizando dados.
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais presentes, mas a API retornou erro</AlertTitle>
              <AlertDescription>
                {status.error || "Verifique o Property ID e se a conta tem acesso à propriedade."}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Não configurado</AlertTitle>
              <AlertDescription>
                Preencha as variáveis abaixo no <code>.env.local</code> e reinicie o servidor.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais (.env.local)</CardTitle>
          <CardDescription>
            Usa o mesmo OAuth client do Google Ads. Consulte <code>docs/google-analytics-setup.md</code> para o passo a passo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ENV_VARS.map((v) => (
            <div key={v.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b pb-2 last:border-0">
              <code className="text-sm font-mono text-foreground">{v.name}</code>
              <span className="text-xs text-muted-foreground">{v.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Refresh Token</CardTitle>
          <CardDescription>
            Ative a <strong>Google Analytics Data API</strong> no Google Cloud, adicione o redirect{" "}
            <code>/api/google-analytics/callback</code> no OAuth client, e gere o token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Faça login com a conta Google que tem acesso à propriedade GA4. O token aparecerá na tela — copie para{" "}
              <code>GOOGLE_ANALYTICS_REFRESH_TOKEN</code> no <code>.env.local</code> e reinicie o servidor.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/api/google-analytics/auth" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Conectar com Google e gerar token
            </a>
          </Button>
          <div className="pt-2">
            <Badge variant="outline">Escopo: https://www.googleapis.com/auth/analytics.readonly</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
