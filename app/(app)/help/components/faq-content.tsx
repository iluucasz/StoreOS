import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes</CardTitle>
        <CardDescription>Respostas para as dúvidas mais comuns dos usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>Como calcular o preço ideal para meus produtos?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                O preço ideal depende de vários fatores, incluindo seus custos, margem desejada e o mercado. Use a
                Calculadora de Preços para inserir o custo do produto, ajustar a margem de lucro e ver o preço
                recomendado. A ferramenta também fornece uma análise de viabilidade que indica se o preço é competitivo
                no mercado.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Para uma análise mais detalhada, use o Simulador de Cenários para testar diferentes estratégias de
                precificação e ver como elas afetam seu lucro total.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger>Como conectar minhas contas de marketing?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Para conectar suas contas de marketing (Facebook Ads, Google Ads, Google Analytics):
              </p>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>Acesse o módulo de Marketing no menu lateral</li>
                <li>Selecione a plataforma que deseja conectar (Facebook Ads, Google Ads ou Google Analytics)</li>
                <li>Clique na aba "Integração"</li>
                <li>Clique no botão "Conectar Conta"</li>
                <li>Siga as instruções para autorizar o acesso à sua conta</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-2">
                Após conectar sua conta, o sistema importará automaticamente seus dados de campanhas e métricas.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger>Como interpretar os dados de marketing?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Os dados de marketing são apresentados em dashboards intuitivos para cada plataforma. Aqui estão algumas
                métricas importantes para monitorar:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>
                  <span className="font-medium">CTR (Taxa de Cliques):</span> Porcentagem de pessoas que clicaram no seu
                  anúncio após vê-lo
                </li>
                <li>
                  <span className="font-medium">CPC (Custo por Clique):</span> Quanto você paga por cada clique no seu
                  anúncio
                </li>
                <li>
                  <span className="font-medium">Conversões:</span> Número de ações desejadas (compras, cadastros)
                  realizadas
                </li>
                <li>
                  <span className="font-medium">ROAS (Retorno sobre Investimento em Anúncios):</span> Quanto você ganha
                  para cada real investido
                </li>
                <li>
                  <span className="font-medium">Engajamento:</span> Como os usuários interagem com seu conteúdo
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Compare estas métricas ao longo do tempo para identificar tendências e oportunidades de otimização.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4">
            <AccordionTrigger>Qual a melhor margem de lucro para meus produtos?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                A margem de lucro ideal varia conforme o tipo de produto, mercado e estratégia de negócio. Como regra
                geral:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>
                  <span className="font-medium">Produtos de baixo custo (próximo a R$30):</span> Margens entre 35-40%
                  são recomendadas
                </li>
                <li>
                  <span className="font-medium">Produtos de custo médio:</span> Margens entre 30-35% são adequadas
                </li>
                <li>
                  <span className="font-medium">Produtos premium (próximo a R$50):</span> Margens entre 25-30% mantêm o
                  preço competitivo
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Use o Simulador de Cenários para testar diferentes margens e ver o impacto no volume de vendas
                necessário para atingir sua meta de lucro.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5">
            <AccordionTrigger>Como exportar relatórios do sistema?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">Para exportar relatórios de qualquer módulo do sistema:</p>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>Acesse o módulo desejado (Calculadora, Simulador, Marketing, etc.)</li>
                <li>Procure pelo botão "Exportar" ou ícone de download</li>
                <li>Selecione o formato desejado (PDF, CSV, Excel)</li>
                <li>O relatório será gerado e baixado automaticamente</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-2">
                Os relatórios exportados contêm todos os dados e gráficos visíveis na tela no momento da exportação.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
