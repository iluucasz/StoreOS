"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoalsProvider, useGoals, type Goal } from "@/contexts/goals-context"
import { formatCurrency } from "@/lib/utils"
import { Target, TrendingUp, TrendingDown, Pencil, Check } from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(value: number, unit: Goal["unit"]) {
  if (unit === "currency") return formatCurrency(value)
  if (unit === "percent") return `${value}%`
  return String(value)
}

function getProgress(goal: Goal): number {
  if (goal.lowerIsBetter) {
    // Progress = how much BELOW target we are (100% = at or below target)
    if (goal.current <= goal.target) return 100
    return Math.max(0, Math.round((goal.target / goal.current) * 100))
  }
  if (goal.target === 0) return 100
  return Math.min(100, Math.round((goal.current / goal.target) * 100))
}

function getStatus(goal: Goal): "great" | "ok" | "at-risk" | "danger" {
  const pct = getProgress(goal)
  // How many days remain in the month (rough)
  const today = new Date("2026-06-08")
  const daysInMonth = 30
  const daysPassed = today.getDate()
  const expectedPct = Math.round((daysPassed / daysInMonth) * 100)

  if (goal.lowerIsBetter) {
    return pct === 100 ? "great" : pct >= 80 ? "ok" : "danger"
  }
  if (pct >= 100) return "great"
  if (pct >= expectedPct) return "ok"
  if (pct >= expectedPct - 15) return "at-risk"
  return "danger"
}

const statusConfig = {
  great: { label: "Meta atingida!", barColor: "bg-emerald-500", textColor: "text-emerald-600" },
  ok: { label: "No ritmo certo", barColor: "bg-blue-500", textColor: "text-blue-600" },
  "at-risk": { label: "Atenção necessária", barColor: "bg-yellow-500", textColor: "text-yellow-600" },
  danger: { label: "Abaixo do esperado", barColor: "bg-red-500", textColor: "text-red-500" },
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: Goal }) {
  const { updateTarget } = useGoals()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(goal.target))

  const progress = getProgress(goal)
  const status = getStatus(goal)
  const cfg = statusConfig[status]
  const remaining = goal.lowerIsBetter
    ? null
    : goal.target - goal.current

  function saveTarget() {
    const v = parseFloat(draft)
    if (!isNaN(v) && v > 0) updateTarget(goal.id, v)
    setEditing(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{goal.label}</CardTitle>
            <p className={`text-xs font-medium mt-0.5 ${cfg.textColor}`}>{cfg.label}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => { setEditing(!editing); setDraft(String(goal.target)) }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tabular-nums">
              {formatValue(goal.current, goal.unit)}
            </p>
            <p className="text-xs text-muted-foreground">atual</p>
          </div>
          <div className="text-right">
            {editing ? (
              <div className="flex items-center gap-1">
                <Input
                  className="h-8 w-28 text-right text-sm"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTarget()}
                  autoFocus
                />
                <Button size="icon" className="h-8 w-8" onClick={saveTarget}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-muted-foreground tabular-nums">
                  {formatValue(goal.target, goal.unit)}
                </p>
                <p className="text-xs text-muted-foreground">meta</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}% da meta</span>
            {remaining !== null && remaining > 0 && (
              <span>faltam {formatValue(remaining, goal.unit)}</span>
            )}
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {status === "great" || status === "ok" ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          {goal.lowerIsBetter
            ? goal.current <= goal.target
              ? `${formatValue(goal.target - goal.current, goal.unit)} abaixo do limite`
              : `${formatValue(goal.current - goal.target, goal.unit)} acima do limite`
            : `${Math.round((new Date("2026-06-08").getDate() / 30) * 100)}% do mês decorrido`
          }
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Summary bar ──────────────────────────────────────────────────────────────

function GoalsSummary({ goals }: { goals: Goal[] }) {
  const statuses = goals.map(getStatus)
  const great = statuses.filter((s) => s === "great").length
  const ok = statuses.filter((s) => s === "ok").length
  const atRisk = statuses.filter((s) => s === "at-risk").length
  const danger = statuses.filter((s) => s === "danger").length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[
        { label: "Atingidas", count: great, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { label: "No ritmo", count: ok, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { label: "Atenção", count: atRisk, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
        { label: "Críticas", count: danger, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
      ].map(({ label, count, color, bg }) => (
        <div key={label} className={`rounded-lg p-3 ${bg}`}>
          <p className={`text-2xl font-bold ${color}`}>{count}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function GoalsContent() {
  const { goals } = useGoals()

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-bold">Metas</h1>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Junho 2026</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Acompanhe o progresso das metas mensais do seu negócio. Clique no lápis para editar qualquer meta.
      </p>

      <GoalsSummary goals={goals} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  )
}

export default function GoalsPage() {
  return (
    <GoalsProvider>
      <GoalsContent />
    </GoalsProvider>
  )
}
