import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MousePointer, ArrowRight, Calculator, LineChart, ShoppingBag, BarChart3 } from "lucide-react"

export function NavigationGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          Navegação Principal
        </CardTitle>
        <CardDescription>Aprenda a navegar pelo sistema e acessar as principais funcionalidades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Barra Lateral</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A barra lateral à esquerda é o menu principal de navegação. Ela contém:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1 rounded">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Dashboard</p>
                  <p className="text-sm text-muted-foreground">Visão geral do seu negócio com métricas principais</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1 rounded">
                  <Calculator className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Calculadora</p>
                  <p className="text-sm text-muted-foreground">Ferramenta para calcular preços de produtos</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1 rounded">
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Simulador</p>
                  <p className="text-sm text-muted-foreground">Simule diferentes cenários de precificação</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1 rounded">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Produtos</p>
                  <p className="text-sm text-muted-foreground">Gerencie seu catálogo de produtos</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 bg-primary/10 p-1 rounded">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Marketing (Accordion)</p>
                  <p className="text-sm text-muted-foreground">Clique para expandir e ver as opções de marketing</p>
                  <ul className="mt-2 ml-6 space-y-2">
                    <li className="text-sm">
                      <span className="font-medium">Dashboard:</span> Visão geral das campanhas de marketing
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Facebook Ads:</span> Gerenciamento de campanhas no Facebook
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Google Ads:</span> Gerenciamento de campanhas no Google
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Google Analytics:</span> Análise de tráfego do site
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
