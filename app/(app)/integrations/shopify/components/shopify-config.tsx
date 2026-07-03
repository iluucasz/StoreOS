"use client"

import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle, ExternalLink, Loader2, RefreshCcw, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ShopifyStatus } from "../page"

interface ShopifyConfigProps {
  status: ShopifyStatus
  onRecheck: () => void
}

function cleanShop(value: string) {
  return value.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
}

export function ShopifyConfig({ status, onRecheck }: ShopifyConfigProps) {
  const [shop, setShop] = useState(status.myshopify_domain ?? "")
  const normalizedShop = useMemo(() => cleanShop(shop), [shop])
  const canConnect = normalizedShop.length > 0

  function connect() {
    if (!canConnect) return
    window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(normalizedShop)}`
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4 text-[#96bf48]" />
            Conexão Shopify
          </CardTitle>
          <CardDescription>Conecte a loja deste usuário usando OAuth. Tokens não precisam ser copiados manualmente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.loading ? (
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando conexão...
            </div>
          ) : status.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Shopify conectado com sucesso.
              </div>
              <div className="grid gap-3 rounded-md border px-4 py-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Loja</p>
                  <p className="font-medium">{status.shop ?? "Shopify"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Domínio</p>
                  {status.domain ? (
                    <a
                      href={`https://${status.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {status.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="font-mono text-xs">{status.myshopify_domain ?? "-"}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Plano</p>
                  <p>{status.plan ?? "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Autenticação</p>
                  <p>OAuth por usuário</p>
                </div>
              </div>
            </div>
          ) : status.error ? (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {status.error}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Nenhuma loja conectada para este usuário.
            </div>
          )}

          <div className="grid gap-2">
            <label htmlFor="shopify-shop" className="text-sm font-medium">
              Domínio da loja
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="shopify-shop"
                value={shop}
                onChange={(event) => setShop(event.target.value)}
                placeholder="minha-loja.myshopify.com"
                autoComplete="off"
              />
              <Button type="button" onClick={connect} disabled={!canConnect} className="shrink-0">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Entrar com Shopify
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Use o domínio myshopify.com da loja. O token será salvo criptografado no perfil do usuário.</p>
          </div>

          <Button type="button" variant="outline" onClick={onRecheck} disabled={status.loading}>
            {status.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Verificar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
