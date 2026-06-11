import { NavigationGuide } from "./navigation-guide"
import { CalculatorGuide } from "./calculator-guide"
import { SimulatorGuide } from "./simulator-guide"
import { MarketingGuide } from "./marketing-guide"
import { ProductsGuide } from "./products-guide"
import { SettingsGuide } from "./settings-guide"

export function GuideContent() {
  return (
    <div className="space-y-6">
      <NavigationGuide />
      <CalculatorGuide />
      <SimulatorGuide />
      <MarketingGuide />
      <ProductsGuide />
      <SettingsGuide />
    </div>
  )
}
