"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Info, AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TikTokIcon } from "@/components/brand-icons"
import type { TikTokStatus } from "../page"

interface TikTokIntegrationProps {
  status: TikTokStatus
  onRecheck: () => void
}

const ENV_VARS: { name: string; description: string }[] = [
  { name: "TIKTOK_APP_ID", description: "App ID (TikTok for Business / developers.tiktok.com)" },
  { name: "TIKTOK_APP_SECRET", description: "Secret do app" },
  { name: "TIKTOK_ACCESS_TOKEN", description: "Gerado pelo botão abaixo (fluxo OAuth)" },
  { name: "TIKTOK_ADVERTISER_ID", description: "ID do anunciante (advertiser_id)" },
]

export function TikTokIntegration({ status, onRecheck }: TikTokIntegrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TikTokIcon className="h-5 w-5" />
              Status da Integração
            </span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Conexão com a TikTok Marketing API</CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Verificando conexão...
            </p>
          ) : status.connected ? (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Conectado</AlertTitle>
              <AlertDescription className="text-green-700">
                {status.account?.name
                  ? `Anunciante "${status.account.name}" conectado e sincronizando.`
                  : "Sua conta do TikTok Ads está conectada."}
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais presentes, mas a API retornou erro</AlertTitle>
              <AlertDescription>{status.error || "Verifique o token e o advertiser ID."}</AlertDescription>
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
            Consulte <code>docs/tiktok-ads-setup.md</code> para o passo a passo completo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ENV_VARS.map((v) => (
            <div
              key={v.name}
              className="flex flex-col gap-1 border-b pb-2 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <code className="font-mono text-sm text-foreground">{v.name}</code>
              <span className="text-xs text-muted-foreground">{v.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Token de Acesso</CardTitle>
          <CardDescription>
            Depois de criar o app no TikTok for Business e preencher App ID/Secret, autorize para gerar o token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Faça login com a conta que administra o anunciante. O token e os <code>advertiser_ids</code> autorizados
              aparecerão na tela — copie para o <code>.env.local</code> e reinicie o servidor.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/api/tiktok-ads/auth" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Conectar com o TikTok e gerar token
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
