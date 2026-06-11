"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Plus, MessageSquare, Trash2, Settings, Sparkles } from "lucide-react"

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
  onOpenSettings: () => void
}

export function ChatSidebar({ sessions, activeId, onSelect, onNew, onDelete, onOpenSettings }: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <div className="flex items-center gap-2 px-1 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Assistente IA</span>
        </div>
        <Button onClick={onNew} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          Nova conversa
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        {sessions.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            Suas conversas aparecerão aqui.
          </p>
        ) : (
          <div className="space-y-0.5 pb-2">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Histórico</p>
            {sessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors",
                  s.id === activeId ? "bg-secondary" : "hover:bg-secondary/60",
                )}
                onClick={() => onSelect(s.id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate leading-tight">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(s.lastAt)}</p>
                </div>
                <button
                  type="button"
                  aria-label="Excluir conversa"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(s.id)
                  }}
                  className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-2">
        <Button variant="ghost" onClick={onOpenSettings} className="w-full justify-start gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
      </div>
    </div>
  )
}
