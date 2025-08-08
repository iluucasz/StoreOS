"use client"

import { useTheme } from "next-themes"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

interface ScenarioChartProps {
  data: any[]
  breakEven: number
  requiredSales: number
}

export function ScenarioChart({ data, breakEven, requiredSales }: ScenarioChartProps) {
  const { theme } = useTheme()

  const formatCurrency = (value: number) => {
    return `R${value.toFixed(2)}`
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${label} vendas`}</p>
          <p className="text-sm text-blue-500">{`Receita: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-sm text-red-500">{`Custos: ${formatCurrency(payload[1].value)}`}</p>
          <p className={`text-sm ${payload[2].value >= 0 ? "text-green-500" : "text-red-500"}`}>
            {`Lucro: ${formatCurrency(payload[2].value)}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
        <XAxis
          dataKey="sales"
          label={{ value: "Vendas", position: "insideBottomRight", offset: -5 }}
          stroke={theme === "dark" ? "#888" : "#333"}
        />
        <YAxis tickFormatter={formatCurrency} stroke={theme === "dark" ? "#888" : "#333"} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine x={breakEven} stroke="#ff7300" label="Break-even" />
        <ReferenceLine x={requiredSales} stroke="#82ca9d" label="Meta" />
        <Line type="monotone" dataKey="revenue" name="Receita" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="costs" name="Custos" stroke="#ef4444" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="profit" name="Lucro" stroke="#10b981" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
