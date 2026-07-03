"use client"

import { AlertCircle, Check, ExternalLink, Info, Loader2, RefreshCw } from "lucide-react"
import { TikTokIcon } from "@/components/brand-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TikTokStatus } from "../page"

interface TikTokIntegrationProps {
  status: TikTokStatus
  onRecheck: () => void
}

export function TikTokIntegration({ status, onRecheck }: TikTokIntegrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <TikTokIcon className="h-5 w-5" />
              Status da Integração
            </span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Conexão da conta deste usuário com a TikTok Marketing API.</CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Verificando conexão...
            </p>
          ) : status.connected ? (
            <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
              <Check className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700 dark:text-emerald-400">Conectado</AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                {status.account?.name
                  ? `Anunciante "${status.account.name}" conectado.`
                  : "Sua conta do TikTok Ads está conectada."}
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais salvas, mas a API retornou erro</AlertTitle>
              <AlertDescription>{status.error || "Verifique o acesso ao anunciante TikTok."}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Não conectado</AlertTitle>
              <AlertDescription>Faça login com a conta que administra o anunciante no TikTok.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conectar TikTok Ads</CardTitle>
          <CardDescription>
            O access token será salvo criptografado para o usuário logado. Se houver vários anunciantes, o app usa o
            primeiro anunciante acessível por enquanto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="gap-2">
            <a href="/api/tiktok-ads/auth">
              <ExternalLink className="h-4 w-4" />
              Entrar com TikTok
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
