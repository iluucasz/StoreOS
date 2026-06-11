"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Trash2 } from "lucide-react"

interface IaSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterToSend: boolean
  onEnterToSendChange: (value: boolean) => void
  onClearHistory: () => Promise<void> | void
}

export function IaSettingsDialog({
  open,
  onOpenChange,
  enterToSend,
  onEnterToSendChange,
  onClearHistory,
}: IaSettingsDialogProps) {
  const [confirming, setConfirming] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleClear = async () => {
    setClearing(true)
    await onClearHistory()
    setClearing(false)
    setConfirming(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setConfirming(false)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações da OSIA</DialogTitle>
          <DialogDescription>Preferências da OSIA e do histórico de conversas.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Modelo */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Llama 3.3 70B</p>
                <p className="text-xs text-muted-foreground">via Groq · dados reais da Shopify</p>
              </div>
            </div>
          </div>

          {/* Enter para enviar */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enter-to-send">Enter para enviar</Label>
              <p className="text-xs text-muted-foreground">
                {enterToSend ? "Enter envia · Shift+Enter quebra linha" : "Ctrl+Enter envia · Enter quebra linha"}
              </p>
            </div>
            <Switch id="enter-to-send" checked={enterToSend} onCheckedChange={onEnterToSendChange} />
          </div>

          <Separator />

          {/* Limpar histórico */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <Label>Histórico de conversas</Label>
              <p className="text-xs text-muted-foreground">Exclui permanentemente todas as conversas salvas.</p>
            </div>
            {confirming ? (
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={handleClear} disabled={clearing}>
                  {clearing ? "Excluindo..." : "Confirmar exclusão"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={clearing}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={() => setConfirming(true)}>
                <Trash2 className="h-4 w-4" />
                Limpar todo o histórico
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
