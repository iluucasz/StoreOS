"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, Loader2 } from "lucide-react"

type TestState = "idle" | "loading" | "success" | "error"

interface WhatsAppConfigProps {
  isConnected: boolean
  setIsConnected: (v: boolean) => void
}

export function WhatsAppConfig({ isConnected, setIsConnected }: WhatsAppConfigProps) {
  const [phone, setPhone] = useState(isConnected ? "+55 11 99999-0000" : "")
  const [apiKey, setApiKey] = useState(isConnected ? "EAABxxxxxx..." : "")
  const [webhookUrl, setWebhookUrl] = useState("https://storeos.app/api/whatsapp/webhook")
  const [testState, setTestState] = useState<TestState>("idle")
  const [automations, setAutomations] = useState({
    abandonedCart: true,
    orderConfirmation: true,
    orderShipped: false,
    paymentReminder: false,
  })

  async function handleTest() {
    setTestState("loading")
    await new Promise((r) => setTimeout(r, 1500))
    setTestState("success")
    setIsConnected(true)
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API do WhatsApp Business</CardTitle>
          <CardDescription>Configure sua conta do WhatsApp Business API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="wa-phone">Número do WhatsApp Business</Label>
            <Input id="wa-phone" placeholder="+55 11 99999-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="wa-api-key">API Key</Label>
            <Input id="wa-api-key" type="password" placeholder="EAABxxxxxx..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="wa-webhook">Webhook URL</Label>
            <Input id="wa-webhook" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
            <p className="text-xs text-muted-foreground">Use esta URL no painel do WhatsApp Business API</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleTest}
              disabled={!phone || !apiKey || testState === "loading"}
              className="flex-1"
            >
              {testState === "loading" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Testar Conexão
            </Button>
            {isConnected && (
              <Button variant="outline" onClick={() => { setIsConnected(false); setApiKey(""); setPhone(""); setTestState("idle") }}>
                Desconectar
              </Button>
            )}
          </div>

          {testState === "success" && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-md px-3 py-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Conexão bem-sucedida!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Automações</CardTitle>
          <CardDescription>Ative o envio automático de mensagens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "orderConfirmation", label: "Confirmação de Pedido", desc: "Enviar ao confirmar pagamento" },
            { key: "orderShipped", label: "Pedido Enviado", desc: "Enviar ao atualizar status para Enviado" },
            { key: "abandonedCart", label: "Carrinho Abandonado", desc: "Enviar 1h após abandono" },
            { key: "paymentReminder", label: "Lembrete de Pagamento", desc: "Enviar 24h antes do vencimento" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={automations[key as keyof typeof automations]}
                onCheckedChange={(v) => setAutomations((prev) => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
