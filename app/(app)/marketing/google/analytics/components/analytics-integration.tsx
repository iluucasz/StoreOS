"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Check, ExternalLink, Info, Loader2, RefreshCw, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AnalyticsStatus } from "../page"

interface AnalyticsIntegrationProps {
  status: AnalyticsStatus
  onRecheck: () => void
  notice?: { type: "success" | "error"; message: string } | null
}

export function AnalyticsIntegration({ status, onRecheck, notice }: AnalyticsIntegrationProps) {
  const [propertyId, setPropertyId] = useState(status.account?.id ?? "")
  const cleanPropertyId = useMemo(() => propertyId.replace(/\D/g, ""), [propertyId])

  useEffect(() => {
    if (status.account?.id) setPropertyId(status.account.id)
  }, [status.account?.id])

  function connect() {
    if (!cleanPropertyId) return
    window.location.href = `/api/google-analytics/auth?propertyId=${encodeURIComponent(cleanPropertyId)}`
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <Alert
          variant={notice.type === "error" ? "destructive" : "default"}
          className={notice.type === "success" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20" : undefined}
        >
          {notice.type === "success" ? <Check className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{notice.type === "success" ? "Integração concluída" : "Não foi possível conectar"}</AlertTitle>
          <AlertDescription>{notice.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Status da integração</span>
            <Button variant="outline" size="sm" onClick={onRecheck} disabled={status.loading} className="gap-2">
              {status.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verificar
            </Button>
          </CardTitle>
          <CardDescription>Conexão da sua conta com o Google Analytics 4.</CardDescription>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando conexão...
            </p>
          ) : status.connected ? (
            <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
              <Check className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-700 dark:text-emerald-400">Conectado</AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                {status.account?.id
                  ? `Propriedade GA4 ${status.account.id} conectada.`
                  : "Sua propriedade do Google Analytics 4 está conectada e pronta para consultar dados."}
              </AlertDescription>
            </Alert>
          ) : status.configured ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Credenciais salvas, mas a API retornou erro</AlertTitle>
              <AlertDescription>
                {status.error || "Verifique o ID da propriedade e se a conta Google tem acesso a ela."}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Não conectado</AlertTitle>
              <AlertDescription>
                Informe o ID numérico da propriedade GA4 e faça login com a conta Google que tem acesso a ela.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{status.connected ? "Trocar propriedade conectada" : "Conectar Google Analytics"}</CardTitle>
            <CardDescription>
              A autorização é individual para sua conta. Você não precisa copiar token nem configurar servidor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga-property-id">ID da propriedade GA4</Label>
              <Input
                id="ga-property-id"
                inputMode="numeric"
                placeholder="Ex.: 485221982"
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use o ID numérico da propriedade. Ele é diferente do ID de medição que começa com G-.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button onClick={connect} disabled={!cleanPropertyId} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                {status.connected ? "Reconectar com Google" : "Entrar com Google"}
              </Button>
              <Badge variant="outline">Acesso somente leitura</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Segurança da conexão
            </CardTitle>
            <CardDescription>O que acontece quando você entra com o Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Permissão solicitada</p>
              <p>Leitura dos relatórios do Google Analytics 4.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Dados por usuário</p>
              <p>Cada usuário conecta a própria propriedade. Uma conta não usa os dados de outra.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Revogação</p>
              <p>Você pode remover o acesso a qualquer momento na sua Conta Google.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como encontrar o ID da propriedade</CardTitle>
          <CardDescription>Use o número da propriedade GA4 para conectar a fonte correta.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <li className="rounded-md border p-3">
              <span className="mb-1 block font-medium text-foreground">1. Acesse o GA4</span>
              Entre no Google Analytics e selecione a propriedade do seu site.
            </li>
            <li className="rounded-md border p-3">
              <span className="mb-1 block font-medium text-foreground">2. Abra o Admin</span>
              Vá em Administrador e depois em Configurações da propriedade.
            </li>
            <li className="rounded-md border p-3">
              <span className="mb-1 block font-medium text-foreground">3. Copie o ID</span>
              Use apenas o número da propriedade, por exemplo 485221982.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
