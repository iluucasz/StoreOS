"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Eye, MessageSquare, UserX } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const weekData = [
  { day: "Seg", enviadas: 42, abertas: 38 },
  { day: "Ter", enviadas: 55, abertas: 51 },
  { day: "Qua", enviadas: 38, abertas: 30 },
  { day: "Qui", enviadas: 61, abertas: 55 },
  { day: "Sex", enviadas: 70, abertas: 62 },
  { day: "Sáb", enviadas: 28, abertas: 24 },
  { day: "Dom", enviadas: 15, abertas: 12 },
]

function Kpi({ title, value, icon: Icon, sub }: { title: string; value: string; icon: LucideIcon; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export function WhatsAppDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Kpi title="Enviadas (7d)" value="309" icon={Send} sub="esta semana" />
        <Kpi title="Taxa de Abertura" value="87%" icon={Eye} sub="acima da média" />
        <Kpi title="Taxa de Resposta" value="42%" icon={MessageSquare} sub="engajamento" />
        <Kpi title="Opt-outs" value="3" icon={UserX} sub="esta semana" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mensagens — Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enviadas" fill="#25d366" name="Enviadas" radius={[3, 3, 0, 0]} />
                <Bar dataKey="abertas" fill="#128c7e" name="Abertas" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
