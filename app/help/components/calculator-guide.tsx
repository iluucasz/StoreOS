import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calculator } from "lucide-react"

export function CalculatorGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculadora de Preços
        </CardTitle>
        <CardDescription>Como calcular o preço ideal para seus produtos</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="calc-1">
            <AccordionTrigger>Como acessar a calculadora</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para acessar a calculadora de preços:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    Clique no ícone <Calculator className="h-4 w-4 inline" /> na barra lateral
                  </li>
                  <li>Ou clique em "Calculadora" no menu lateral</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calc-2">
            <AccordionTrigger>Como calcular o preço de um produto</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para calcular o preço de um produto, siga estes passos:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Insira o custo do produto (entre R$30 e R$50)</li>
                  <li>Defina a quantidade de produtos no mesmo lote</li>
                  <li>Ajuste a margem de lucro desejada usando o controle deslizante</li>
                  <li>O preço de venda recomendado será exibido automaticamente</li>
                  <li>Veja a análise de viabilidade para entender se o preço é competitivo</li>
                  <li>Consulte a projeção de lucro para diferentes volumes de venda</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calc-3">
            <AccordionTrigger>Como interpretar a análise de viabilidade</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A análise de viabilidade mostra se o preço calculado é competitivo no mercado:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="text-green-500 font-medium">Verde:</span> Preço competitivo, boa margem de lucro
                  </li>
                  <li>
                    <span className="text-yellow-500 font-medium">Amarelo:</span> Preço na média do mercado
                  </li>
                  <li>
                    <span className="text-red-500 font-medium">Vermelho:</span> Preço alto, pode dificultar vendas
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Use esta análise para ajustar sua estratégia de precificação e encontrar o equilíbrio ideal entre
                  lucro e competitividade.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
