import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, LineChart, Facebook } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Estratégias de Precificação</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Precificação por Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ofereça descontos para compras múltiplas, diluindo o custo do frete.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Margem Dinâmica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Use margens maiores para produtos de menor custo.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacotes Promocionais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Crie conjuntos de produtos complementares com desconto.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monitoramento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ajuste preços conforme seus custos e metas mudam.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Calculadora de Preço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Calcule o preço ideal para seus produtos com base nos custos e margem desejada.
            </p>
            <Button asChild>
              <Link href="/calculator">Acessar Calculadora</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Simulador de Cenários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simule diferentes cenários de vendas para planejar sua estratégia de precificação.
            </p>
            <Button asChild>
              <Link href="/simulator">Acessar Simulador</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Facebook className="mr-2 h-5 w-5" />
              Marketing Integrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Integre suas campanhas de marketing com sua estratégia de precificação para maximizar o ROI.
            </p>
            <Button asChild>
              <Link href="/marketing">Acessar Marketing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
