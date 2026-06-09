"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, SendHorizonal, TrendingDown, Package, Target, Lightbulb } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  cards?: InsightCard[]
}

type InsightCard = {
  title: string
  value: string
  detail: string
  positive?: boolean
}

const SUGGESTED_QUESTIONS = [
  "Por que as vendas caíram esta semana?",
  "Qual produto devo anunciar agora?",
  "Onde estou perdendo mais dinheiro?",
  "Qual campanha tem melhor ROAS?",
]

const MOCK_RESPONSES: Record<string, Message> = {
  "Por que as vendas caíram esta semana?": {
    role: "assistant",
    content:
      "Analisei seus dados de GA4, Meta Ads e pedidos dos últimos 14 dias. Identifiquei 3 fatores que explicam a queda de 18% nas vendas:",
    cards: [
      {
        title: "Alcance Meta Ads caiu",
        value: "-34%",
        detail: "Seu CPM subiu R$ 4,20 → R$ 7,80 com a entrada de concorrentes no leilão. Recomendo aumentar o orçamento ou ajustar o público.",
        positive: false,
      },
      {
        title: "Abandono de carrinho subiu",
        value: "+22%",
        detail: "O Conjunto Verão teve 338 carrinhos abandonados esta semana. O frete grátis acima de R$ 150 pode estar travando conversões.",
        positive: false,
      },
      {
        title: "Vestido Casual sem estoque",
        value: "0 unid.",
        detail: "Seu 2º produto mais vendido ficou sem estoque por 4 dias. Isso impactou diretamente a receita orgânica.",
        positive: false,
      },
    ],
  },
  "Qual produto devo anunciar agora?": {
    role: "assistant",
    content:
      "Com base em visualizações, margem, estoque e taxa de conversão, o melhor produto para anunciar agora é:",
    cards: [
      {
        title: "Conjunto Verão",
        value: "Anunciar agora",
        detail: "3.200 visualizações · 8% add-to-cart · Estoque: 5 unid. · Margem: 38% · Alta intenção de compra detectada.",
        positive: true,
      },
      {
        title: "Por que não o Vestido Casual?",
        value: "Estoque crítico",
        detail: "Ótima margem (40%), mas só 8 unidades restantes. Reabasteça antes de escalar os anúncios.",
        positive: false,
      },
      {
        title: "Sugestão de orçamento",
        value: "R$ 80/dia",
        detail: "Com ROAS atual de 3.5x, esse orçamento gera R$ 280/dia em receita com margem de R$ 106/dia.",
        positive: true,
      },
    ],
  },
  "Onde estou perdendo mais dinheiro?": {
    role: "assistant",
    content:
      "Cruzei gastos de anúncios, taxas e produtos sem giro. Encontrei 3 pontos de vazamento no seu negócio:",
    cards: [
      {
        title: "Estoque parado",
        value: "R$ 2.160",
        detail: "A Saia Midi tem 12 unidades × R$ 30 de custo sem girar há 45 dias. Capital parado.",
        positive: false,
      },
      {
        title: "CPA acima do ideal",
        value: "R$ 12,50",
        detail: "Campanha de Verão tem CPA de R$ 26,67 — acima da meta de R$ 15. Pausar e redistribuir para Promoção Especial.",
        positive: false,
      },
      {
        title: "Taxa de plataforma",
        value: "2% sobre tudo",
        detail: "Você paga R$ 530/mês em taxas de plataforma. Verifique se o plano atual ainda é o mais adequado para o volume.",
        positive: false,
      },
    ],
  },
  "Qual campanha tem melhor ROAS?": {
    role: "assistant",
    content: "Analisei todas as campanhas ativas de Meta Ads e Google Ads dos últimos 30 dias:",
    cards: [
      {
        title: "Lançamento Coleção",
        value: "ROAS 3.8x",
        detail: "R$ 1.500 gastos · R$ 5.700 gerados · 60 conversões. Melhor campanha ativa. Aumentar orçamento.",
        positive: true,
      },
      {
        title: "Promoção Especial",
        value: "ROAS 3.5x",
        detail: "R$ 800 gastos · R$ 2.800 gerados · 32 conversões. Boa performance. Manter estável.",
        positive: true,
      },
      {
        title: "Campanha de Verão",
        value: "ROAS 3.2x",
        detail: "R$ 1.200 gastos · R$ 3.840 gerados · 45 conversões. Abaixo da média. Revisar criativos.",
        positive: false,
      },
    ],
  },
}

function AssistantMessage({ message }: { message: Message }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <p className="text-sm leading-relaxed pt-0.5">{message.content}</p>
      </div>
      {message.cards && (
        <div className="ml-0 sm:ml-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {message.cards.map((card, i) => (
            <Card key={i} className={`border ${card.positive === false ? "border-red-200 dark:border-red-900" : card.positive ? "border-emerald-200 dark:border-emerald-900" : ""}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs shrink-0 ${
                      card.positive === false
                        ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                        : card.positive
                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                        : ""
                    }`}
                  >
                    {card.value}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function IaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = (question?: string) => {
    const q = question ?? input.trim()
    if (!q) return

    const userMsg: Message = { role: "user", content: q }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    setTimeout(() => {
      const matchKey = Object.keys(MOCK_RESPONSES).find((k) =>
        q.toLowerCase().includes(k.toLowerCase().slice(0, 15))
      )
      const response: Message = matchKey
        ? MOCK_RESPONSES[matchKey]
        : {
            role: "assistant",
            content:
              "Analisei seus dados. Para uma resposta mais precisa, conecte o Google Analytics e suas plataformas de anúncios. Enquanto isso, posso trabalhar com os dados do seu catálogo de produtos.",
          }
      setMessages((prev) => [...prev, response])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">IA</h1>
        <p className="text-sm text-muted-foreground">
          Pergunte sobre sua loja — a IA analisa GA4, Meta, pedidos e produtos para responder
        </p>
      </div>

      {messages.length === 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Perguntas frequentes</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-left px-4 py-3 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  Diagnóstico de vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Analisa GA4, Meta e pedidos para explicar quedas e picos de vendas
                </p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Recomendação de produto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Cruza visualizações, margem, estoque e intenção de compra para recomendar o que anunciar
                </p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Eficiência de campanhas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Compara ROAS, CPA e conversões entre Meta Ads e Google Ads
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-6 mb-6">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="bg-secondary rounded-lg px-4 py-2 max-w-[85%] sm:max-w-sm">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ) : (
              <AssistantMessage key={i} message={msg} />
            )
          )}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Analisando seus dados...</p>
            </div>
          )}
        </div>
      )}

      <div className="sticky bottom-6">
        <div className="flex gap-2 bg-background/80 backdrop-blur-sm rounded-xl border p-3 shadow-lg">
          <Textarea
            placeholder="Pergunte sobre sua loja..."
            className="min-h-0 h-10 resize-none border-0 shadow-none focus-visible:ring-0 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button size="icon" className="shrink-0" onClick={() => handleSend()} disabled={!input.trim() || loading}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Conecte GA4, Meta Ads e Google Ads nas Configurações para análises em tempo real
        </p>
      </div>
    </div>
  )
}
