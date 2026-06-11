import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Settings } from "lucide-react"

export function SettingsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações
        </CardTitle>
        <CardDescription>Como personalizar as configurações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="set-1">
            <AccordionTrigger>Como acessar as configurações</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para acessar as configurações do sistema:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    Clique no ícone <Settings className="h-4 w-4 inline" /> na barra lateral
                  </li>
                  <li>Ou clique em "Configurações" no menu lateral</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="set-2">
            <AccordionTrigger>Como ajustar os parâmetros de custos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para ajustar os parâmetros de custos:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Acesse a página de Configurações</li>
                  <li>
                    Na seção "Custos", você pode ajustar:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Custo de frete</li>
                      <li>Orçamento de marketing</li>
                      <li>Custo de embalagem</li>
                      <li>Taxa de pagamento</li>
                      <li>Vendas mensais esperadas</li>
                    </ul>
                  </li>
                  <li>Clique em "Salvar Configurações" para aplicar as mudanças</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-2">
                  Estes parâmetros são usados nos cálculos da Calculadora e do Simulador.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="set-3">
            <AccordionTrigger>Como alterar o tema do sistema</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para alterar entre o tema claro e escuro:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Clique no botão de tema no canto superior direito da tela</li>
                  <li>Selecione entre "Claro", "Escuro" ou "Sistema" (segue as configurações do seu dispositivo)</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
