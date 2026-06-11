"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Check,
  Copy,
  DollarSign,
  Menu,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  SendHorizonal,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"
import { ChatSidebar, type SessionSummary } from "./components/chat-sidebar"
import { ChatMarkdown } from "./components/chat-markdown"
import { IaSettingsDialog } from "./components/ia-settings-dialog"

type Message = { role: "user" | "assistant"; content: string }

const newId = () => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`

export default function IaPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [sessionId, setSessionId] = useState(() => newId())
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameValue, setRenameValue] = useState("")
  const [renaming, setRenaming] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [enterToSend, setEnterToSend] = useState(true)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const loadSuggestions = useCallback(async (id: string, nextMessages: Message[]) => {
    if (!id) return

    setSuggestionsLoading(true)
    try {
      const res = await fetch("/api/ia/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, messages: nextMessages }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const json = await res.json()
      const nextSuggestions = Array.isArray(json.suggestions)
        ? json.suggestions
            .filter((item: unknown): item is string => typeof item === "string")
            .map((item: string) => item.trim())
            .filter(Boolean)
            .slice(0, 3)
        : []
      setSuggestions(nextSuggestions)
    } catch {
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }, [])

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/ia/sessions", { cache: "no-store" })
      if (!res.ok) return
      const json = await res.json()
      setSessions(json.sessions ?? [])
    } catch {
      /* Mantem o chat utilizavel mesmo se o historico falhar. */
    }
  }, [])

  useEffect(() => {
    const pref = localStorage.getItem("ia-enter-to-send")
    if (pref !== null) setEnterToSend(pref === "true")
    void refreshSessions()
    void loadSuggestions(sessionId, [])
  }, [refreshSessions, loadSuggestions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streaming])

  const updateEnterToSend = (value: boolean) => {
    setEnterToSend(value)
    localStorage.setItem("ia-enter-to-send", String(value))
  }

  const newChat = () => {
    const nextId = newId()
    setSessionId(nextId)
    setMessages([])
    setStreaming("")
    setInput("")
    setSuggestions([])
    setMobileOpen(false)
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    void loadSuggestions(nextId, [])
  }

  const selectSession = async (id: string) => {
    setMobileOpen(false)
    if (id === sessionId) return
    setSessionId(id)
    setStreaming("")
    setInput("")
    try {
      const res = await fetch(`/api/ia/sessions/${id}`, { cache: "no-store" })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const json = await res.json()
      const nextMessages = Array.isArray(json.messages) ? json.messages : []
      setMessages(nextMessages)
      void loadSuggestions(id, nextMessages)
    } catch {
      setMessages([])
      setSuggestions([])
    }
  }

  const deleteSession = async (id: string) => {
    const res = await fetch(`/api/ia/sessions/${id}`, { method: "DELETE" })
    if (!res.ok) return
    await refreshSessions()
    if (id === sessionId) newChat()
  }

  const requestDeleteSession = (id: string) => {
    if (!id) return
    setDeleteTargetId(id)
    setDeleteOpen(true)
  }

  const confirmDeleteSession = async () => {
    if (!deleteTargetId) return

    setDeleting(true)
    await deleteSession(deleteTargetId)
    setDeleting(false)
    setDeleteOpen(false)
    setDeleteTargetId("")
  }

  const renameSession = async (id: string, title: string) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, title } : session)))
    const res = await fetch(`/api/ia/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) {
      await refreshSessions()
      return
    }
    const json = await res.json()
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, title: json.title ?? title } : session)),
    )
  }

  const openRenameCurrent = () => {
    setRenameValue(currentTitle === "Nova conversa" ? "" : currentTitle)
    setRenameOpen(true)
  }

  const submitRenameCurrent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = renameValue.trim()
    if (!nextTitle) return

    setRenaming(true)
    await renameSession(sessionId, nextTitle)
    setRenaming(false)
    setRenameOpen(false)
  }

  const clearHistory = async () => {
    await fetch("/api/ia/sessions", { method: "DELETE" })
    await refreshSessions()
    newChat()
  }

  const handleSend = async (question?: string) => {
    const q = (question ?? input).trim()
    if (!q || loading) return

    const userMsg: Message = { role: "user", content: q }
    const messagesWithQuestion = [...messages, userMsg]
    setMessages(messagesWithQuestion)
    setInput("")
    setSuggestions([])
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setLoading(true)
    setStreaming("")

    try {
      const res = await fetch("/api/ia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, sessionId }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      if (!res.body) throw new Error("Resposta vazia")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setStreaming(fullText)
      }

      const messagesWithAnswer: Message[] = [...messagesWithQuestion, { role: "assistant", content: fullText }]
      setMessages(messagesWithAnswer)
      setStreaming("")
      await refreshSessions()
      void loadSuggestions(sessionId, messagesWithAnswer)
    } catch (error) {
      console.error(error)
      const errorMessages: Message[] = [
        ...messagesWithQuestion,
        { role: "assistant", content: "Ocorreu um erro ao processar sua mensagem. Tente novamente." },
      ]
      setMessages(errorMessages)
      setStreaming("")
      void loadSuggestions(sessionId, errorMessages)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const shouldSend = enterToSend ? !event.shiftKey : event.ctrlKey || event.metaKey
    if (event.key === "Enter" && shouldSend) {
      event.preventDefault()
      void handleSend()
    }
  }

  const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    const el = event.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const activeSession = sessions.find((session) => session.id === sessionId)
  const firstUserMessage = messages.find((message) => message.role === "user")?.content
  const currentTitle = activeSession?.title || firstUserMessage || "Nova conversa"
  const canManageCurrentChat = Boolean(activeSession || messages.length > 0)
  const deleteTargetTitle =
    (deleteTargetId === sessionId ? currentTitle : sessions.find((session) => session.id === deleteTargetId)?.title) ||
    "esta conversa"

  const sidebar = (
    <ChatSidebar
      sessions={sessions}
      activeId={sessionId}
      onSelect={selectSession}
      onNew={newChat}
      onDelete={requestDeleteSession}
      onRename={renameSession}
      onOpenSettings={() => {
        setMobileOpen(false)
        setSettingsOpen(true)
      }}
    />
  )

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-background">
      <aside className="hidden w-80 shrink-0 flex-col border-r md:flex">{sidebar}</aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(20rem,calc(100vw-2rem))] p-0">
          <SheetTitle className="sr-only">Conversas da OSIA</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-5">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir conversas">
            <Menu className="h-5 w-5" />
          </Button>
          <OsiaAvatar className="hidden sm:flex" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-tight">OSIA</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                online
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{currentTitle}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Opções do chat">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={newChat}>
                <Plus className="h-4 w-4" />
                Nova conversa
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!canManageCurrentChat} onSelect={openRenameCurrent}>
                <Pencil className="h-4 w-4" />
                Renomear conversa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canManageCurrentChat}
                className="text-destructive focus:text-destructive"
                onSelect={() => requestDeleteSession(sessionId)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir conversa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 py-4 sm:px-6 sm:py-6">
            {messages.length === 0 && !loading ? (
              <EmptyState suggestions={suggestions} loading={suggestionsLoading} onPick={handleSend} />
            ) : (
              <div className="space-y-5 pb-4">
                {messages.map((message, index) =>
                  message.role === "user" ? (
                    <UserMessage key={`${message.role}-${index}`} content={message.content} />
                  ) : (
                    <AssistantMessage key={`${message.role}-${index}`} content={message.content} />
                  ),
                )}
                {loading && streaming && <AssistantMessage content={streaming} streaming />}
                {loading && !streaming && (
                  <div className="flex items-center gap-3">
                    <OsiaAvatar />
                    <p className="text-sm text-muted-foreground">OSIA está analisando os dados da loja...</p>
                  </div>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="shrink-0 border-t bg-background/95">
          <div className="mx-auto w-full max-w-4xl px-3 py-2 sm:px-6">
            {messages.length > 0 && !loading && (suggestionsLoading || suggestions.length > 0) && (
              <div className="mb-1.5">
                <PromptSuggestions compact suggestions={suggestions} loading={suggestionsLoading} onPick={handleSend} />
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border bg-background p-1.5 shadow-sm focus-within:ring-1 focus-within:ring-ring">
              <Textarea
                ref={textareaRef}
                placeholder="Pergunte para a OSIA..."
                className="max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none focus-visible:ring-0"
                rows={1}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-lg"
                onClick={() => void handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Enviar mensagem"
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </footer>
      </div>

      <IaSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        enterToSend={enterToSend}
        onEnterToSendChange={updateEnterToSend}
        onClearHistory={clearHistory}
      />

      <Dialog
        open={renameOpen}
        onOpenChange={(open) => {
          if (!open && !renaming) setRenameOpen(false)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submitRenameCurrent} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Renomear conversa</DialogTitle>
              <DialogDescription>Use um nome curto para encontrar este chat no histórico.</DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              maxLength={80}
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              placeholder="Ex.: Plano de vendas da semana"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenameOpen(false)} disabled={renaming}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!renameValue.trim() || renaming}>
                {renaming ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open && !deleting) setDeleteTargetId("")
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir conversa?</DialogTitle>
            <DialogDescription>
              Essa ação apaga permanentemente "{deleteTargetTitle}" do histórico da OSIA.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteSession} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir conversa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OsiaAvatar({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-background shadow-sm ring-1 ring-border",
        large ? "h-14 w-14 rounded-2xl" : "h-9 w-9 rounded-xl",
        className,
      )}
    >
      <img src="/osia_rosto.png" alt="" className="h-full w-full object-cover" />
    </span>
  )
}

function CopyAction({ content, align = "left" }: { content: string; align?: "left" | "right" }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100",
        align === "right" && "self-end",
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="group flex justify-end">
      <div className="flex max-w-[min(38rem,88%)] flex-col items-end">
        <div className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
          {content}
        </div>
        <CopyAction content={content} align="right" />
      </div>
    </div>
  )
}

function AssistantMessage({ content, streaming }: { content: string; streaming?: boolean }) {
  return (
    <div className="group flex items-start gap-3">
      <OsiaAvatar />
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-background px-4 py-3 shadow-sm ring-1 ring-border/70">
        <ChatMarkdown content={content} />
        {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-foreground/40 align-middle" />}
        {!streaming && content && <CopyAction content={content} />}
      </div>
    </div>
  )
}

function EmptyState({
  suggestions,
  loading,
  onPick,
}: {
  suggestions: string[]
  loading: boolean
  onPick: (question: string) => void
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
      <div className="h-24 w-72 overflow-hidden rounded-2xl bg-background sm:h-28 sm:w-80">
        <img src="/osia_logo_completo_fundo_branco.png" alt="OSIA" className="h-full w-full object-cover" />
      </div>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Converse sobre vendas, estoque, margem e próximos passos da sua loja.
      </p>
      <div className="mt-5 w-full max-w-xl">
        <PromptSuggestions suggestions={suggestions} loading={loading} onPick={onPick} />
      </div>
    </div>
  )
}

function getSuggestionIcon(text: string) {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  if (/(faturamento|receita|ticket|lucro|margem|custo)/.test(normalized)) return DollarSign
  if (/(pedido|compra)/.test(normalized)) return ReceiptText
  if (/(estoque|produto)/.test(normalized)) return Package
  if (/(cliente|conversao)/.test(normalized)) return Users
  return TrendingUp
}

function PromptSuggestions({
  suggestions,
  loading,
  onPick,
  compact = false,
}: {
  suggestions: string[]
  loading: boolean
  onPick: (question: string) => void
  compact?: boolean
}) {
  if (loading) {
    return (
      <div className={cn(compact ? "flex gap-1.5 overflow-x-auto pb-1" : "flex flex-wrap justify-center gap-2")}>
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex h-8 animate-pulse rounded-full border bg-muted",
              compact ? "w-40 shrink-0" : "w-44",
            )}
          />
        ))}
      </div>
    )
  }

  if (suggestions.length === 0) return null

  return (
    <div className={cn(compact ? "flex gap-1.5 overflow-x-auto pb-1" : "flex flex-wrap justify-center gap-2")}>
      {suggestions.map((text) => (
        <SuggestionChip key={text} text={text} compact={compact} onPick={onPick} />
      ))}
    </div>
  )
}

function SuggestionChip({
  text,
  compact,
  onPick,
}: {
  text: string
  compact: boolean
  onPick: (question: string) => void
}) {
  const Icon = getSuggestionIcon(text)

  return (
    <button
      type="button"
      onClick={() => onPick(text)}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border bg-background px-3 text-left text-xs transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring",
        compact ? "max-w-[17rem] shrink-0" : "max-w-[19rem]",
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <span className="truncate">{text}</span>
    </button>
  )
}
