import { createHmac, timingSafeEqual } from "crypto"

type WebToLeadPayload = {
  purpose: "web_to_lead"
  userId: string
  version: 1
}

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error("SESSION_SECRET não configurado")
  return value
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createWebToLeadToken(userId: string) {
  const payload: WebToLeadPayload = { purpose: "web_to_lead", userId, version: 1 }
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  return `${body}.${sign(body)}`
}

export function verifyWebToLeadToken(token: string | null | undefined): string | null {
  if (!token) return null

  const [body, signature] = token.split(".")
  if (!body || !signature || !safeEqual(sign(body), signature)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<WebToLeadPayload>
    if (payload.purpose !== "web_to_lead" || payload.version !== 1 || !payload.userId) return null
    return payload.userId
  } catch {
    return null
  }
}
