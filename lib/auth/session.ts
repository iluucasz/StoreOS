import { createHmac, randomBytes, timingSafeEqual } from "crypto"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { sessions, users } from "@/lib/db/schema"

export const SESSION_COOKIE = "storeos_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error("SESSION_SECRET não configurado")
  return s
}

/** Sign a token producing `token.signature` (HMAC-SHA256) to detect tampering. */
export function signToken(token: string): string {
  const sig = createHmac("sha256", secret()).update(token).digest("hex")
  return `${token}.${sig}`
}

/** Verify a signed cookie value and return the raw token, or null if tampered. */
export function verifyToken(signed: string | undefined): string | null {
  if (!signed) return null
  const idx = signed.lastIndexOf(".")
  if (idx < 0) return null
  const token = signed.slice(0, idx)
  const sig = signed.slice(idx + 1)
  const expected = createHmac("sha256", secret()).update(token).digest("hex")
  try {
    const a = Buffer.from(sig, "hex")
    const b = Buffer.from(expected, "hex")
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  return token
}

export async function createSession(userId: string): Promise<{ token: string; signed: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  await db.insert(sessions).values({ id: token, userId, expiresAt })
  return { token, signed: signToken(token), expiresAt }
}

export async function validateSession(signed: string | undefined) {
  const token = verifyToken(signed)
  if (!token) return null

  const rows = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, token))
    return null
  }

  return {
    session: { id: row.sessionId, expiresAt: row.expiresAt },
    user: { id: row.userId, email: row.email, name: row.name, image: row.image },
  }
}

export async function invalidateSession(signedOrToken: string | undefined) {
  const token = verifyToken(signedOrToken) ?? signedOrToken
  if (!token) return
  await db.delete(sessions).where(eq(sessions.id, token))
}
