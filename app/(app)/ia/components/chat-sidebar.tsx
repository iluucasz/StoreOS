"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Pencil, Plus, Settings, Trash2 } from "lucide-react"

export type SessionSummary = { id: string; title: string; lastAt: string; count: number }

function timeAgo(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 60) return "agora"
  if (s < 3600) return `${Math.floor(s / 60)} min`
  if (s < 86400) return `${Math.floor(s / 3600)} h`
  if (s < 172800) return "ontem"
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

interface ChatSidebarProps {
  sessions: SessionSummary[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => Promise<void> | void
  onOpenSettings: () => void
}

export function ChatSidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onOpenSettings,
}: ChatSidebarProps) {
  const [renaming, setRenaming] = useState<SessionSummary | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [savingRename, setSavingRename] = useState(false)

  const openRename = (session: SessionSummary) => {
    setRenaming(session)
    setRenameValue(session.title)
  }

  const submitRename = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!renaming) return

    const nextTitle = renameValue.trim()
    if (!nextTitle) return

    setSavingRename(true)
    await onRename(renaming.id, nextTitle)
    setSavingRename(false)
    setRenaming(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex h-16 shrink-0 items-center justify-center border-b px-5">
        <img
          src="/osia_logo_horizontal.png"
          alt="OSIA"
          className="h-12 w-auto max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Histórico</p>
        <Button
          size="sm"
          onClick={onNew}
          className="h-7 gap-1 rounded-full bg-[#8b5cf6] px-2.5 text-xs text-white shadow-sm hover:bg-[#7c3aed]"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova conversa
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-2">
        {sessions.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground">Suas conversas aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-0.5 pb-2">
            {sessions.map((session) => (
              <div key={session.id} className="group relative">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2.5 pr-10 text-left transition-colors",
                    session.id === activeId ? "bg-muted text-foreground" : "hover:bg-muted/60",
                  )}
                  onClick={() => onSelect(session.id)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm leading-tight">{session.title}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {timeAgo(session.lastAt)} · {session.count} {session.count === 1 ? "mensagem" : "mensagens"}
                    </span>
                  </span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Opções da conversa"
                      className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={() => openRename(session)}>
                      <Pencil className="h-4 w-4" />
                      Renomear conversa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => onDelete(session.id)}>
                      <Trash2 className="h-4 w-4" />
                      Excluir conversa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 pt-2">
        <Button variant="ghost" onClick={onOpenSettings} className="h-9 w-full justify-start gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
      </div>

      <Dialog
        open={Boolean(renaming)}
        onOpenChange={(open) => {
          if (!open && !savingRename) setRenaming(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submitRename} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Renomear conversa</DialogTitle>
              <DialogDescription>Escolha um nome curto para encontrar este chat depois.</DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              maxLength={80}
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              placeholder="Ex.: Plano de anúncios da semana"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenaming(null)} disabled={savingRename}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!renameValue.trim() || savingRename}>
                {savingRename ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
