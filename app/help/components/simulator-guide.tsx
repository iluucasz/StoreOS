import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LineChart } from "lucide-react"

export function SimulatorGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Simulador de Cenários
        </CardTitle>
        <CardDescription>Como simular diferentes cenários de precificação</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="sim-1">
            <AccordionTrigger>Como acessar o simulador</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para acessar o simulador de cenários:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    Clique no ícone <LineChart className="h-4 w-4 inline" /> na barra lateral
                  </li>
                  <li>Ou clique em "Simulador" no menu lateral</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sim-2">
            <AccordionTrigger>Como simular diferentes cenários</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O simulador permite testar diferentes estratégias de precificação:
                </p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Defina o total de produtos comprados</li>
                  <li>Insira o custo médio por produto</li>
                  <li>Ajuste o orçamento de marketing</li>
                  <li>Defina a margem de lucro desejada</li>
                  <li>O simulador mostrará quantas vendas são necessárias para atingir sua meta</li>
                  <li>O gráfico exibirá diferentes cenários baseados nas suas configurações</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sim-3">
            <AccordionTrigger>Como interpretar o gráfico de cenários</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O gráfico de cenários mostra diferentes projeções baseadas nos seus parâmetros:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="text-blue-500 font-medium">Linha azul:</span> Cenário otimista
                  </li>
                  <li>
                    <span className="text-green-500 font-medium">Linha verde:</span> Cenário realista
                  </li>
                  <li>
                    <span className="text-orange-500 font-medium">Linha laranja:</span> Cenário pessimista
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Compare os cenários para entender os riscos e oportunidades da sua estratégia de precificação.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
