import { PriceCalculator } from "@/app/calculator/components/price-calculator"

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-md md:max-w-2xl lg:max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Calculadora de Preço</h1>
      <PriceCalculator />
    </div>
  )
}
