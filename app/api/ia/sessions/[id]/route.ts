import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getSessionMessages, deleteSession } from "@/lib/db"

/** Mensagens de uma conversa. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const { id } = await params
  const messages = await getSessionMessages(id, user.id)
  return NextResponse.json({ messages })
}

/** Exclui uma conversa. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  const { id } = await params
  await deleteSession(id, user.id)
  return NextResponse.json({ ok: true })
}
