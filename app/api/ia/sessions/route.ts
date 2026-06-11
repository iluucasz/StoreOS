import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { clearSessions, initSchema, listSessions } from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })

  await initSchema()
  const sessions = await listSessions(user.id)

  return NextResponse.json({ sessions })
}

export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })

  await initSchema()
  await clearSessions(user.id)

  return NextResponse.json({ ok: true })
}
