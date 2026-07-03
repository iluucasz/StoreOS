import { createHmac, randomBytes, timingSafeEqual } from "crypto"
import type { IntegrationProvider } from "@/lib/integrations/store"

type OAuthStatePayload = {
  userId: string
  provider: IntegrationProvider
  expiresAt: number
  nonce: string
  data?: Record<string, string>
}

function secret(): string {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error("SESSION_SECRET não configurado")
  return value
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createOAuthState(input: {
  userId: string
  provider: IntegrationProvider
  data?: Record<string, string>
  ttlMs?: number
}) {
  const payload: OAuthStatePayload = {
    userId: input.userId,
    provider: input.provider,
    expiresAt: Date.now() + (input.ttlMs ?? 10 * 60 * 1000),
    nonce: randomBytes(16).toString("base64url"),
    data: input.data,
  }
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  return `${body}.${sign(body)}`
}

export function verifyOAuthState(value: string | null, provider: IntegrationProvider): OAuthStatePayload | null {
  if (!value) return null

  const [body, signature] = value.split(".")
  if (!body || !signature || !safeEqual(sign(body), signature)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as OAuthStatePayload
    if (payload.provider !== provider || payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
