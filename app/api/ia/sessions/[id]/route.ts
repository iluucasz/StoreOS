import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { deleteSession, getSessionMessages, initSchema, renameSession } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })

  const { id } = await params
  await initSchema()
  const messages = await getSessionMessages(id, user.id)

  return NextResponse.json({ messages })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })

  const { id } = await params
  const { title } = await request.json()
  const cleanTitle = typeof title === "string" ? title.trim().replace(/\s+/g, " ").slice(0, 80) : ""

  if (!cleanTitle) {
    return NextResponse.json({ error: "title e obrigatorio" }, { status: 400 })
  }

  await initSchema()
  const renamed = await renameSession(id, user.id, cleanTitle)
  if (!renamed) {
    return NextResponse.json({ error: "Conversa nao encontrada" }, { status: 404 })
  }

  return NextResponse.json({ ok: true, title: cleanTitle })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })

  const { id } = await params
  await initSchema()
  await deleteSession(id, user.id)

  return NextResponse.json({ ok: true })
}
