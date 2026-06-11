"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ScenarioChartProps {
  data: any[]
  breakEven: number
  requiredSales: number
}

export function ScenarioChart({ data, breakEven, requiredSales }: ScenarioChartProps) {
  const { theme } = useTheme()

  // Garantir que temos dados válidos para o gráfico
  const validData = Array.isArray(data) && data.length > 0 ? data : []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Receita",
          color: "hsl(var(--chart-1))",
        },
        costs: {
          label: "Custos",
          color: "hsl(var(--chart-2))",
        },
        profit: {
          label: "Lucro",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
          <XAxis
            dataKey="sales"
            label={{ value: "Vendas", position: "insideBottomRight", offset: -5 }}
            stroke={theme === "dark" ? "#888" : "#333"}
            domain={[0, "dataMax"]}
            allowDecimals={false}
            tickCount={5}
          />
          <YAxis tickFormatter={formatCurrency} stroke={theme === "dark" ? "#888" : "#333"} allowDataOverflow={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend verticalAlign="top" height={36} />

          {breakEven > 0 && (
            <ReferenceLine
              x={breakEven}
              stroke="#ff7300"
              label={{
                value: "Break-even",
                position: "top",
                fill: theme === "dark" ? "#fff" : "#000",
                fontSize: 12,
              }}
            />
          )}

          {requiredSales > 0 && (
            <ReferenceLine
              x={requiredSales}
              stroke="#82ca9d"
              label={{
                value: "Meta",
                position: "top",
                fill: theme === "dark" ? "#fff" : "#000",
                fontSize: 12,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="revenue"
            name="Receita"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="costs"
            name="Custos"
            stroke="var(--color-costs)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Lucro"
            stroke="var(--color-profit)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
