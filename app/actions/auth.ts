"use server"

import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users, settings, userCredentials } from "@/lib/db/schema"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createSession, invalidateSession, SESSION_COOKIE } from "@/lib/auth/session"

type ActionState = { error?: string }

async function setSessionCookie(userId: string) {
  const { signed, expiresAt } = await createSession(userId)
  const store = await cookies()
  store.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

export async function signup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!name || !email || !password) return { error: "Preencha todos os campos." }
  if (password.length < 6) return { error: "A senha deve ter ao menos 6 caracteres." }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existing[0]) return { error: "Já existe uma conta com esse e-mail." }

  const id = randomUUID()
  const passwordHash = await hashPassword(password)
  await db.insert(users).values({ id, email, name, passwordHash })
  await db.insert(settings).values({ userId: id })
  await db.insert(userCredentials).values({ userId: id })

  await setSessionCookie(id)
  redirect("/")
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Informe e-mail e senha." }

  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  const user = rows[0]
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou senha inválidos." }
  }

  await setSessionCookie(user.id)
  redirect("/")
}

export async function logout() {
  const store = await cookies()
  const signed = store.get(SESSION_COOKIE)?.value
  await invalidateSession(signed)
  store.delete(SESSION_COOKIE)
  redirect("/login")
}
