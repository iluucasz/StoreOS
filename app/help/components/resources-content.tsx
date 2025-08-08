import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, LineChart, ShoppingBag, Facebook, BarChart3, PieChart, Search } from "lucide-react"

export function ResourcesContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recursos do Sistema</CardTitle>
          <CardDescription>Conheça todas as funcionalidades disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Calculadora de Preços</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Calcule o preço ideal para seus produtos com base em:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Custo do produto</li>
                <li>Quantidade no lote</li>
                <li>Margem de lucro desejada</li>
                <li>Custos fixos (frete, embalagem, etc.)</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Simulador de Cenários</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Simule diferentes estratégias de precificação:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Teste diferentes margens de lucro</li>
                <li>Veja o impacto de diferentes volumes de venda</li>
                <li>Compare cenários otimistas, realistas e pessimistas</li>
                <li>Analise o ponto de equilíbrio</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Facebook className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Facebook Ads</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Gerencie suas campanhas no Facebook:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Dashboard com métricas principais</li>
                <li>Gerenciamento de campanhas</li>
                <li>Segmentação de públicos</li>
                <li>Configuração de Pixel</li>
                <li>Análise de desempenho</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Google Ads</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Gerencie suas campanhas no Google:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Dashboard com métricas principais</li>
                <li>Gerenciamento de campanhas</li>
                <li>Pesquisa de palavras-chave</li>
                <li>Acompanhamento de conversões</li>
                <li>Otimização de anúncios</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Google Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Analise o tráfego do seu site:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Visão geral do tráfego</li>
                <li>Fontes de aquisição</li>
                <li>Comportamento dos usuários</li>
                <li>Conversões e objetivos</li>
                <li>Análise de e-commerce</li>
                <li>Dados em tempo real</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Gerenciamento de Produtos</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Gerencie seu catálogo de produtos:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Cadastro de produtos</li>
                <li>Categorização</li>
                <li>Controle de custos e preços</li>
                <li>Histórico de alterações</li>
                <li>Exportação de dados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca Rápida
          </CardTitle>
          <CardDescription>Encontre rapidamente o que precisa</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Use a busca rápida para encontrar qualquer recurso ou funcionalidade do sistema:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                K
              </kbd>
              <span className="ml-2 text-sm text-muted-foreground">Abrir a busca rápida</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Digite o que está procurando e navegue pelos resultados usando as setas do teclado. Pressione Enter para
              acessar o item selecionado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
