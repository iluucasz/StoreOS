"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"

type TestState = "idle" | "loading" | "success" | "error"

interface ShopifyConfigProps {
  isConnected: boolean
  setIsConnected: (v: boolean) => void
}

interface ShopInfo {
  shop: string
  domain: string
  myshopify_domain: string
  plan: string
}

export function ShopifyConfig({ isConnected, setIsConnected }: ShopifyConfigProps) {
  const [testState, setTestState] = useState<TestState>(isConnected ? "success" : "idle")
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleTest() {
    setTestState("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/shopify/test")
      const data = await res.json()
      if (data.ok) {
        setTestState("success")
        setShopInfo(data)
        setIsConnected(true)
      } else {
        setTestState("error")
        setErrorMsg(data.error ?? "Erro desconhecido")
        setIsConnected(false)
      }
    } catch {
      setTestState("error")
      setErrorMsg("Falha ao conectar com o servidor")
      setIsConnected(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conexão Shopify</CardTitle>
          <CardDescription>
            Integração configurada via variáveis de ambiente no servidor (.env.local)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted/50 px-4 py-3 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Domínio</span>
              <span className="font-mono text-xs">uy9jyb-i2.myshopify.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Token</span>
              <span className="font-mono text-xs">shpat_••••••••••••••••</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Escopos</span>
              <span className="text-xs">orders, products, inventory, customers</span>
            </div>
          </div>

          <Button onClick={handleTest} disabled={testState === "loading"} className="w-full">
            {testState === "loading" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Testar Conexão
          </Button>

          {testState === "success" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Conectado com sucesso!
              </div>
              {shopInfo && (
                <div className="rounded-md border px-4 py-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loja</span>
                    <span className="font-medium">{shopInfo.shop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domínio</span>
                    <a href={`https://${shopInfo.domain}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs flex items-center gap-1 text-blue-600 hover:underline">
                      {shopInfo.domain} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano</span>
                    <span>{shopInfo.plan}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {testState === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Como atualizar as credenciais</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Edite o arquivo <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">.env.local</span> na raiz do projeto:</p>
          <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">{`SHOPIFY_STORE_DOMAIN=uy9jyb-i2.myshopify.com\nSHOPIFY_ACCESS_TOKEN=shpat_...`}</pre>
          <p>Reinicie o servidor após alterar.</p>
        </CardContent>
      </Card>
    </div>
  )
}
