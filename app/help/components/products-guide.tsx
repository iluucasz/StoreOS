import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShoppingBag } from "lucide-react"

export function ProductsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Produtos
        </CardTitle>
        <CardDescription>Como gerenciar seu catálogo de produtos</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="prod-1">
            <AccordionTrigger>Como acessar o catálogo de produtos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para acessar o catálogo de produtos:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>
                    Clique no ícone <ShoppingBag className="h-4 w-4 inline" /> na barra lateral
                  </li>
                  <li>Ou clique em "Produtos" no menu lateral</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prod-2">
            <AccordionTrigger>Como adicionar um novo produto</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para adicionar um novo produto ao catálogo:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Acesse a página de Produtos</li>
                  <li>Clique no botão "Adicionar Produto"</li>
                  <li>Preencha os campos obrigatórios: Nome, Descrição, Custo, Preço de Venda</li>
                  <li>Selecione a categoria do produto</li>
                  <li>Clique em "Salvar" para adicionar o produto ao catálogo</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prod-3">
            <AccordionTrigger>Como editar ou excluir um produto</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Para editar um produto existente:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Acesse a página de Produtos</li>
                  <li>Localize o produto na tabela</li>
                  <li>Clique no ícone de edição (lápis) na coluna de ações</li>
                  <li>Faça as alterações necessárias</li>
                  <li>Clique em "Salvar" para atualizar o produto</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-2">Para excluir um produto:</p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Acesse a página de Produtos</li>
                  <li>Localize o produto na tabela</li>
                  <li>Clique no ícone de exclusão (lixeira) na coluna de ações</li>
                  <li>Confirme a exclusão na caixa de diálogo</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
