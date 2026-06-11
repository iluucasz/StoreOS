import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { listSessions, clearSessions } from "@/lib/db"

/** Lista as conversas do usuário. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const sessions = await listSessions(user.id)
  return NextResponse.json({ sessions })
}

/** Exclui todo o histórico do usuário. */
export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  await clearSessions(user.id)
  return NextResponse.json({ ok: true })
}
