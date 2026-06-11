"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Info, AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { GoogleAdsStatus } from "../page"

interface GoogleAdsIntegrationProps {
  status: GoogleAdsStatus
  onRecheck: () => void
}

const ENV_VARS: { name: string; description: string }[] = [
  { name: "GOOGLE_ADS_CLIENT_ID", description: "Client ID do OAuth (Google Cloud Console)" },
  { name: "GOOGLE_ADS_CLIENT_SECRET", description: "Client Secret do OAuth" },
  { name: "GOOGLE_ADS_DEVELOPER_TOKEN", description: "Developer token (aprovado no Google Ads API Center)" },
  { name: "GOOGLE_ADS_REFRESH_TOKEN", description: "Gerado pelo botão abaixo (fluxo OAuth)" },
  { name: "GOOGLE_ADS_CUSTOMER_ID", description: "ID da conta de anúncios (10 dígitos, sem traços)" },
  { name: "GOOGLE_ADS_LOGIN_CUSTOMER_ID", description: "Opcional — ID da conta gerenciadora MCC, sem traços" },
]

export function GoogleAdsIntegration({ status, onRecheck }: GoogleAdsIntegrationProps) {
  return (
    <div className="space-y-6">
      {/* Status atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Status da Integração</span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Estado atual da conexão com a Google Ads API</CardDescription>
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
                {status.account?.name
                  ? `Conta "${status.account.name}" (${status.account.id}) conectada e sincronizando.`
                  : "Sua conta do Google Ads está conectada."}
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais presentes, mas a API retornou erro</AlertTitle>
              <AlertDescription>
                {status.error || "Verifique o developer token e o customer ID."}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Não configurado</AlertTitle>
              <AlertDescription>
                Preencha as variáveis de ambiente abaixo no arquivo <code>.env.local</code> e reinicie o servidor.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Variáveis de ambiente */}
      <Card>
        <CardHeader>
          <CardTitle>Credenciais (.env.local)</CardTitle>
          <CardDescription>
            Esta integração usa variáveis de ambiente, igual à da Shopify. Consulte{" "}
            <code>docs/google-ads-setup.md</code> para o passo a passo completo.
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

      {/* Gerar refresh token */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Refresh Token</CardTitle>
          <CardDescription>
            Depois de preencher o Client ID e o Client Secret, gere o refresh token via OAuth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Faça login com a conta Google dona da conta de anúncios. O token aparecerá na tela — copie para{" "}
              <code>GOOGLE_ADS_REFRESH_TOKEN</code> no <code>.env.local</code> e reinicie o servidor.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/api/google-ads/auth" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Conectar com Google e gerar token
            </a>
          </Button>
          <div className="pt-2">
            <Badge variant="outline">Escopo: https://www.googleapis.com/auth/adwords</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
