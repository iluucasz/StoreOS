"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { SimulatorData } from "../advanced-simulator"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus, BarChart3, Percent } from "lucide-react"

interface AdvancedOptionsStepProps {
  data: SimulatorData
  updateData: (data: Partial<SimulatorData>) => void
  results?: any
  isCalculating?: boolean
}

export function AdvancedOptionsStep({ data, updateData }: AdvancedOptionsStepProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precisão da estimativa */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              <Label htmlFor="estimation-accuracy" className="font-medium text-base">
                Precisão da estimativa
              </Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    id="estimation-accuracy"
                    min={50}
                    max={95}
                    step={5}
                    value={[data.estimationAccuracy]}
                    onValueChange={(value) => updateData({ estimationAccuracy: value[0] })}
                  />
                </div>
                <div className="w-16 h-9 flex items-center justify-center font-medium bg-primary text-primary-foreground rounded-md">
                  {data.estimationAccuracy}%
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>50%</span>
                <span>65%</span>
                <span>80%</span>
                <span>95%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Quanto maior a precisão, menor a variação entre os cenários pessimista e otimista
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tipo de projeção */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <Label className="font-medium text-base">Tipo de projeção</Label>
          </div>

          <RadioGroup
            value={data.projectionType}
            onValueChange={(value) =>
              updateData({ projectionType: value as "pessimistic" | "realistic" | "optimistic" })
            }
            className="grid grid-cols-1 gap-3"
          >
            <Card
              className={`border cursor-pointer transition-all ${
                data.projectionType === "pessimistic"
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md"
                  : "hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/10"
              }`}
              onClick={() => updateData({ projectionType: "pessimistic" })}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <RadioGroupItem
                  value="pessimistic"
                  id="pessimistic"
                  className="data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                />
                <div className="flex-1">
                  <Label htmlFor="pessimistic" className="flex items-center gap-2 cursor-pointer">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Pessimista</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projeção conservadora, considerando cenários menos favoráveis
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border cursor-pointer transition-all ${
                data.projectionType === "realistic"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                  : "hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
              }`}
              onClick={() => updateData({ projectionType: "realistic" })}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <RadioGroupItem
                  value="realistic"
                  id="realistic"
                  className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                />
                <div className="flex-1">
                  <Label htmlFor="realistic" className="flex items-center gap-2 cursor-pointer">
                    <Minus className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Realista</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projeção equilibrada, baseada em expectativas moderadas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border cursor-pointer transition-all ${
                data.projectionType === "optimistic"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md"
                  : "hover:border-green-200 hover:bg-green-50/50 dark:hover:bg-green-950/10"
              }`}
              onClick={() => updateData({ projectionType: "optimistic" })}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <RadioGroupItem
                  value="optimistic"
                  id="optimistic"
                  className="data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
                />
                <div className="flex-1">
                  <Label htmlFor="optimistic" className="flex items-center gap-2 cursor-pointer">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Otimista</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projeção ambiciosa, considerando cenários mais favoráveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
