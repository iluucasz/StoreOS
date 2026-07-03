"use client"

import { AlertCircle, Check, ExternalLink, Info, Loader2, RefreshCw } from "lucide-react"
import { MetaIcon } from "@/components/brand-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MetaStatus } from "../page"

interface FacebookIntegrationProps {
  status: MetaStatus
  onRecheck: () => void
}

export function FacebookIntegration({ status, onRecheck }: FacebookIntegrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <MetaIcon className="h-5 w-5 text-[#0866FF]" />
              Status da Integração
            </span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Conexão da conta deste usuário com a Meta Marketing API.</CardDescription>
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
                  ? `Conta "${status.account.name}" conectada.`
                  : "Sua conta de anúncios da Meta está conectada."}
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais salvas, mas a API retornou erro</AlertTitle>
              <AlertDescription>{status.error || "Verifique o acesso da conta à conta de anúncios."}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Não conectado</AlertTitle>
              <AlertDescription>Faça login com a conta que administra a conta de anúncios da Meta.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conectar Meta Ads</CardTitle>
          <CardDescription>
            O access token será salvo criptografado para o usuário logado. Se houver várias contas, o app usa a primeira
            conta acessível por enquanto.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild className="gap-2">
            <a href="/api/meta-ads/auth">
              <ExternalLink className="h-4 w-4" />
              Entrar com Meta
            </a>
          </Button>
          <Badge variant="outline">Permissão: ads_read</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
