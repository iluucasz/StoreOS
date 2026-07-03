import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"

const PREFIX = "v1"

function base64url(buffer: Buffer): string {
  return buffer.toString("base64url")
}

function fromBase64url(value: string): Buffer {
  return Buffer.from(value, "base64url")
}

function key(): Buffer {
  const configured = process.env.INTEGRATION_ENCRYPTION_KEY

  if (configured) {
    if (/^[a-f0-9]{64}$/i.test(configured)) return Buffer.from(configured, "hex")
    const decoded = Buffer.from(configured, "base64")
    if (decoded.length === 32) return decoded
  }

  const fallback = process.env.SESSION_SECRET
  if (!fallback) throw new Error("INTEGRATION_ENCRYPTION_KEY ou SESSION_SECRET não configurado")

  return createHash("sha256").update(fallback).digest()
}

export function encryptSecret(value: string | null | undefined): string | null {
  if (!value) return null

  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key(), iv)
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return [PREFIX, base64url(iv), base64url(tag), base64url(encrypted)].join(":")
}

export function decryptSecret(value: string | null | undefined): string | null {
  if (!value) return null

  const [prefix, ivPart, tagPart, encryptedPart] = value.split(":")
  if (prefix !== PREFIX || !ivPart || !tagPart || !encryptedPart) return value

  const decipher = createDecipheriv("aes-256-gcm", key(), fromBase64url(ivPart))
  decipher.setAuthTag(fromBase64url(tagPart))

  return Buffer.concat([decipher.update(fromBase64url(encryptedPart)), decipher.final()]).toString("utf8")
}
