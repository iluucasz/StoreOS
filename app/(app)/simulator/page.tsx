import { AdvancedSimulator } from "./components/advanced-simulator"

export default function SimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Simulador de Cenários</h1>
      <AdvancedSimulator />
    </div>
  )
}
