"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Package, DollarSign, Users, Zap, MessageCircle, HelpCircle, BookOpen, Lightbulb } from "lucide-react"

const sections = [
  {
    id: "dashboard",
    icon: BarChart2,
    label: "Dashboard",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    faqs: [
      { q: "O que sao os KPIs do Dashboard?", a: "O Dashboard exibe metricas chave do seu negocio: Receita Total (vendas brutas do periodo), Pedidos (numero de transacoes), Ticket Medio (receita divido por pedidos) e Margem Liquida (lucro divido por receita)." },
      { q: "Como interpretar o grafico de Receita vs. Custos?", a: "O grafico de barras mostra receita (verde) e custos totais (vermelho) por periodo. A diferenca entre as duas barras representa seu lucro bruto." },
      { q: "O que e o Breakeven no Dashboard?", a: "O Breakeven indica o volume de vendas necessario para cobrir todos os custos. Se voce ja ultrapassou esse ponto no mes, cada venda adicional gera lucro puro." },
    ],
  },
  {
    id: "pricing",
    icon: DollarSign,
    label: "Precificacao",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    faqs: [
      { q: "Como funciona a calculadora de precificacao?", a: "Informe o custo do produto, ajuste os sliders de margem desejada, custo de frete, embalagem e taxa de plataforma. O sistema calcula automaticamente o preco de venda sugerido." },
      { q: "O que e margem de contribuicao?", a: "Margem de contribuicao e o percentual da receita que sobra apos pagar os custos variaveis. E o valor disponivel para cobrir custos fixos e gerar lucro. Acima de 60% e saudavel para e-commerce." },
      { q: "Para que serve a analise de cenario?", a: "Permite comparar como diferentes precos de venda impactam sua lucratividade. Util para testar promocoes, avaliar descontos ou planejar reajustes sem comprometer a margem." },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Estoque",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    faqs: [
      { q: "O que significam as classes ABC?", a: "Classe A: top 20% dos produtos que geram ~80% da receita. Classe B: proximos 30% com ~15%. Classe C: 50% restantes com ~5%. Foque em garantir estoque adequado para itens A." },
      { q: "Como funciona a sugestao de reposicao?", a: "O sistema identifica produtos abaixo do minimo e calcula: (estoque minimo x 3) menos estoque atual. O custo estimado usa o preco de custo cadastrado no produto." },
      { q: "O que e 'dias ate ruptura'?", a: "Baseado na velocidade de venda media dos ultimos 30 dias, estima em quantos dias o estoque chegara a zero. Menos de 7 dias: vermelho. Menos de 14 dias: amarelo." },
    ],
  },
  {
    id: "orders",
    icon: Package,
    label: "Pedidos e Devolucoes",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    faqs: [
      { q: "Quais sao os status possiveis de um pedido?", a: "Pendente (aguardando pagamento), Pago (confirmado), Enviado (produto despachado), Entregue (confirmacao de entrega) e Cancelado." },
      { q: "Como funciona o modulo de devolucoes?", a: "Na aba Devolucoes voce registra retornos. Cada devolucao tem: produto, motivo (defeito/arrependimento/tamanho/outro) e status de reembolso (aguardando/aprovada/reembolsada/recusada)." },
    ],
  },
  {
    id: "finance",
    icon: DollarSign,
    label: "Financeiro",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    faqs: [
      { q: "O que e a DRE?", a: "DRE (Demonstracao do Resultado do Exercicio) mostra todas as receitas e despesas num periodo, chegando ao lucro liquido. Inclui receita bruta, devolucoes, CMV, despesas operacionais e lucro final." },
      { q: "Como ler o Fluxo de Caixa?", a: "O grafico mostra entradas (verde) e saidas (vermelho) por periodo. A linha azul e o saldo acumulado. Quando cai abaixo de zero, voce esta consumindo reserva de caixa." },
      { q: "Para que serve o modulo de Contas?", a: "Lista contas a receber e a pagar. Itens com vencimento em ate 3 dias aparecem com alerta. Util para planejar fluxo de caixa dos proximos dias." },
      { q: "Como funciona o modulo de Metas?", a: "Defina metas mensais para receita, pedidos, margem e aquisicao de clientes. O sistema compara progresso atual com o esperado (dias passados dividido por 30)." },
    ],
  },
  {
    id: "crm",
    icon: Users,
    label: "CRM",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    faqs: [
      { q: "Qual a diferenca entre Lead e Contato?", a: "Lead e um potencial cliente que ainda nao comprou. Contato e alguem que ja tem relacionamento com a loja (cliente ativo, parceiro). Leads sao convertidos em contatos quando fecham o primeiro pedido." },
      { q: "O que e o Pipeline de vendas?", a: "O Pipeline mostra todas as oportunidades organizadas por etapa: Prospeccao, Qualificacao, Proposta, Negociacao, Fechado. Use os botoes Avancar/Voltar para mover oportunidades entre etapas." },
      { q: "Como e calculado o valor ponderado?", a: "O valor ponderado multiplica o valor da oportunidade pela probabilidade de fechamento da etapa. A soma representa uma estimativa realista da receita futura." },
    ],
  },
  {
    id: "marketing",
    icon: BarChart2,
    label: "Marketing",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    faqs: [
      { q: "O que e CAC e como e calculado?", a: "CAC (Custo de Aquisicao de Cliente) e o total gasto em marketing dividido pelo numero de novos clientes. Um CAC saudavel deve ser menor que 1/3 do LTV do cliente." },
      { q: "O que e ROAS e como interpretar?", a: "ROAS (Return on Ad Spend) mede quantos reais de receita cada real investido em anuncios gerou. ROAS de 3 significa R$3 de receita para R$1 investido. Acima de 2.5x e bom para e-commerce de moda." },
      { q: "O que e a Retencao por Cohort?", a: "Agrupa clientes pelo mes da primeira compra e mede que percentual voltou a comprar nos meses seguintes. Taxas acima de 30% na semana 4 indicam boa retencao." },
    ],
  },
  {
    id: "integrations",
    icon: Zap,
    label: "Integracoes",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    faqs: [
      { q: "Como conectar o Shopify?", a: "Vá em Integracoes -> Shopify -> Configuracao. Informe a URL da loja e o Access Token gerado no painel Shopify em Apps -> Desenvolver apps. Clique em Testar Conexao para validar." },
      { q: "Como configurar o WhatsApp Business?", a: "Em Integracoes -> WhatsApp -> Configuracao, informe seu numero no formato internacional (+5511...) e a API Key da Meta Business Suite. Ative as automacoes desejadas e salve." },
      { q: "Os dados sao sincronizados em tempo real?", a: "Na versao atual os dados sao demonstrativos (mock). A sincronizacao em tempo real requer conexao real das credenciais de API." },
    ],
  },
  {
    id: "settings",
    icon: MessageCircle,
    label: "Configuracoes",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    faqs: [
      { q: "Onde configuro os dados da minha loja?", a: "Clique em Configuracoes (rodape da sidebar) -> aba Geral. Informe nome da loja, CNPJ e email de contato. Esses dados sao usados nos relatorios." },
      { q: "Como ajustar alertas de estoque?", a: "Em Configuracoes -> Alertas, defina o Threshold de Estoque Baixo (padrao: 5 unidades). Tambem configure o CAC Maximo para receber alertas quando o custo de aquisicao ultrapassar o limite." },
      { q: "Onde ficam salvos meus dados?", a: "Todos os dados do StoreOS sao salvos no localStorage do seu navegador. Os dados persistem entre sessoes mas sao especificos do dispositivo/navegador." },
    ],
  },
]

const tips = [
  { icon: "💡", tip: "Configure o Custo do Produto antes de usar a Precificacao para resultados mais precisos." },
  { icon: "📊", tip: "Revise o DRE mensalmente para identificar quais despesas estao crescendo mais que a receita." },
  { icon: "🎯", tip: "Classifique todos os produtos com ABC no Estoque — itens A nunca devem chegar a estoque zero." },
  { icon: "💬", tip: "Use o Pipeline do CRM para acompanhar negociacoes em andamento e prever receita futura." },
  { icon: "🔔", tip: "Ative as notificacoes de estoque baixo para receber alertas automaticos antes de faltar produto." },
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Central de Ajuda</h1>
          <p className="text-sm text-muted-foreground">Tire duvidas sobre todos os modulos do StoreOS</p>
        </div>
      </div>

      <Card className="mb-8 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Dicas Rapidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((t, i) => (
              <div key={i} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-lg shrink-0">{t.icon}</span>
                <p className="text-muted-foreground leading-snug">{t.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Perguntas Frequentes</h2>
      </div>

      <div className="grid gap-6">
        {sections.map(section => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${section.color}`}>
                <section.icon className="h-3.5 w-3.5" />
                {section.label}
              </span>
            </div>
            <Card>
              <CardContent className="pt-2 pb-2">
                <Accordion type="multiple" className="w-full">
                  {section.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`${section.id}-${i}`} className="border-border">
                      <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-3">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-center">
        <p className="text-sm text-muted-foreground mb-1">Nao encontrou o que precisava?</p>
        <p className="text-sm font-medium">
          Envie um email para{" "}
          <a href="mailto:suporte@storeos.com.br" className="text-primary underline underline-offset-4">
            suporte@storeos.com.br
          </a>
        </p>
      </div>
    </div>
  )
}
