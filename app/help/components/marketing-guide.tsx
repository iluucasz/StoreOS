import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart3 } from "lucide-react"

export function MarketingGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Marketing
        </CardTitle>
        <CardDescription>Como gerenciar suas campanhas de marketing</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="mkt-1">
            <AccordionTrigger>Como acessar o módulo de Marketing</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para acessar o módulo de Marketing:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    Clique no ícone <BarChart3 className="h-4 w-4 inline" /> na barra lateral
                  </li>
                  <li>Ou clique em "Marketing" no menu lateral para expandir as opções</li>
                  <li>Selecione uma das opções disponíveis: Dashboard, Facebook Ads, Google Ads ou Google Analytics</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mkt-2">
            <AccordionTrigger>Facebook Ads</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O módulo de Facebook Ads permite gerenciar suas campanhas no Facebook:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium">Dashboard:</span> Visão geral do desempenho das campanhas
                  </li>
                  <li>
                    <span className="font-medium">Campanhas:</span> Lista de campanhas ativas e seus resultados
                  </li>
                  <li>
                    <span className="font-medium">Públicos:</span> Gerenciamento de públicos-alvo
                  </li>
                  <li>
                    <span className="font-medium">Pixel:</span> Configuração e monitoramento do Pixel do Facebook
                  </li>
                  <li>
                    <span className="font-medium">Integração:</span> Conecte sua conta do Facebook Ads
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Para acessar, clique em "Marketing" e depois em "Facebook Ads" no menu lateral.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mkt-3">
            <AccordionTrigger>Google Ads</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O módulo de Google Ads permite gerenciar suas campanhas no Google:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium">Dashboard:</span> Visão geral do desempenho das campanhas
                  </li>
                  <li>
                    <span className="font-medium">Campanhas:</span> Lista de campanhas ativas e seus resultados
                  </li>
                  <li>
                    <span className="font-medium">Palavras-chave:</span> Gerenciamento de palavras-chave
                  </li>
                  <li>
                    <span className="font-medium">Conversões:</span> Acompanhamento de conversões
                  </li>
                  <li>
                    <span className="font-medium">Integração:</span> Conecte sua conta do Google Ads
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Para acessar, clique em "Marketing" e depois em "Google Ads" no menu lateral.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mkt-4">
            <AccordionTrigger>Google Analytics</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O módulo de Google Analytics permite analisar o tráfego do seu site:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium">Dashboard:</span> Visão geral das métricas de tráfego
                  </li>
                  <li>
                    <span className="font-medium">Aquisição:</span> Como os usuários chegam ao seu site
                  </li>
                  <li>
                    <span className="font-medium">Engajamento:</span> Como os usuários interagem com seu site
                  </li>
                  <li>
                    <span className="font-medium">Conversões:</span> Acompanhamento de objetivos e conversões
                  </li>
                  <li>
                    <span className="font-medium">E-commerce:</span> Análise de vendas online
                  </li>
                  <li>
                    <span className="font-medium">Tempo real:</span> Visitantes ativos no momento
                  </li>
                  <li>
                    <span className="font-medium">Integração:</span> Conecte sua conta do Google Analytics
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Para acessar, clique em "Marketing" e depois em "Google Analytics" no menu lateral.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
