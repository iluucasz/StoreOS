import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceCalculator } from "@/app/(app)/calculator/components/price-calculator"
import { AdvancedSimulator } from "@/app/(app)/simulator/components/advanced-simulator"

export default function PrecificacaoPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-1">Precificação</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Calcule o preço ideal e simule cenários — tudo em uma tela
      </p>
      <Tabs defaultValue="calculadora">
        <TabsList>
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="simulador">Simulador de Cenários</TabsTrigger>
        </TabsList>
        <TabsContent value="calculadora" className="mt-6">
          <PriceCalculator />
        </TabsContent>
        <TabsContent value="simulador" className="mt-6">
          <AdvancedSimulator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
