"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  Sparkles,
  SendHorizonal,
  Menu,
  Plus,
  Copy,
  Check,
  Lightbulb,
  TrendingDown,
  Package,
  Target,
} from "lucide-react"
import { ChatSidebar, type SessionSummary } from "./components/chat-sidebar"
import { ChatMarkdown } from "./components/chat-markdown"
import { IaSettingsDialog } from "./components/ia-settings-dialog"

type Message = { role: "user" | "assistant"; content: string }

const SUGGESTED_QUESTIONS = [
  { icon: TrendingDown, text: "Por que as vendas caíram esta semana?" },
  { icon: Package, text: "Qual produto devo anunciar agora?" },
  { icon: Target, text: "Onde estou perdendo mais dinheiro?" },
  { icon: Lightbulb, text: "Como está o estoque dos meus produtos?" },
]

const newId = () => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`

export default function IaPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [sessionId, setSessionId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [enterToSend, setEnterToSend] = useState(true)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Inicialização: nova conversa + carrega histórico + preferência.
  useEffect(() => {
    setSessionId(newId())
    const pref = localStorage.getItem("ia-enter-to-send")
    if (pref !== null) setEnterToSend(pref === "true")
    refreshSessions()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streaming])

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/ia/sessions", { cache: "no-store" })
      if (!res.ok) return
      const json = await res.json()
      setSessions(json.sessions ?? [])
    } catch {
      /* silencioso */
    }
  }, [])

  const updateEnterToSend = (value: boolean) => {
    setEnterToSend(value)
    localStorage.setItem("ia-enter-to-send", String(value))
  }

  const newChat = () => {
    setSessionId(newId())
    setMessages([])
    setStreaming("")
    setInput("")
    setMobileOpen(false)
  }

  const selectSession = async (id: string) => {
    setMobileOpen(false)
    if (id === sessionId) return
    setSessionId(id)
    setStreaming("")
    try {
      const res = await fetch(`/api/ia/sessions/${id}`, { cache: "no-store" })
      const json = await res.json()
      setMessages(json.messages ?? [])
    } catch {
      setMessages([])
    }
  }

  const deleteSession = async (id: string) => {
    await fetch(`/api/ia/sessions/${id}`, { method: "DELETE" })
    await refreshSessions()
    if (id === sessionId) newChat()
  }

  const clearHistory = async () => {
    await fetch("/api/ia/sessions", { method: "DELETE" })
    await refreshSessions()
    newChat()
  }

  const handleSend = async (question?: string) => {
    const q = question ?? input.trim()
    if (!q || loading) return

    const userMsg: Message = { role: "user", content: q }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
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

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setStreaming(fullText)
      }
      setMessages((prev) => [...prev, { role: "assistant", content: fullText }])
      setStreaming("")
      refreshSessions()
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocorreu um erro ao processar sua mensagem. Tente novamente." },
      ])
      setStreaming("")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const send = enterToSend ? !e.shiftKey : e.ctrlKey || e.metaKey
    if (e.key === "Enter" && send) {
      e.preventDefault()
      handleSend()
    }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const currentTitle = messages.find((m) => m.role === "user")?.content ?? "Nova conversa"

  const sidebar = (
    <ChatSidebar
      sessions={sessions}
      activeId={sessionId}
      onSelect={selectSession}
      onNew={newChat}
      onDelete={deleteSession}
      onOpenSettings={() => {
        setMobileOpen(false)
        setSettingsOpen(true)
      }}
    />
  )

  return (
    <div className="flex h-full overflow-hidden">
      <aside className="hidden w-72 shrink-0 flex-col border-r bg-muted/20 md:flex">{sidebar}</aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Conversas</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior */}
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="truncate text-sm font-medium">{currentTitle}</span>
          <Button variant="ghost" size="sm" className="ml-auto gap-2" onClick={newChat}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova</span>
          </Button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6">
            {messages.length === 0 && !loading ? (
              <EmptyState onPick={handleSend} />
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-secondary px-4 py-2.5 text-sm">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <AssistantMessage key={i} content={msg.content} />
                  ),
                )}
                {loading && streaming && <AssistantMessage content={streaming} streaming />}
                {loading && !streaming && (
                  <div className="flex items-center gap-3">
                    <Avatar />
                    <p className="text-sm text-muted-foreground">Analisando dados da sua loja...</p>
                  </div>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl px-4 py-3">
            <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
              <Textarea
                ref={textareaRef}
                placeholder="Pergunte sobre sua loja..."
                className="max-h-40 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
                rows={1}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              A IA pode cometer erros · dados reais da Shopify · histórico salvo no Neon
            </p>
          </div>
        </div>
      </div>

      <IaSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        enterToSend={enterToSend}
        onEnterToSendChange={updateEnterToSend}
        onClearHistory={clearHistory}
      />
    </div>
  )
}

function Avatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
    </div>
  )
}

function AssistantMessage({ content, streaming }: { content: string; streaming?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="group flex items-start gap-3">
      <Avatar />
      <div className="min-w-0 flex-1 pt-0.5">
        <ChatMarkdown content={content} />
        {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-foreground/40 align-middle" />}
        {!streaming && content && (
          <button
            type="button"
            onClick={copy}
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-8 text-center sm:pt-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-semibold sm:text-2xl">Como posso ajudar na sua loja?</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Pergunte sobre vendas, estoque, margem ou marketing — analiso os dados reais da sua Shopify.
      </p>
      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            onClick={() => onPick(text)}
            className="flex items-center gap-3 rounded-xl border border-border p-3 text-left text-sm transition-colors hover:bg-secondary"
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
