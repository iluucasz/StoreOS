import { getIntegrationSecrets, getUserIntegration } from "@/lib/integrations/store"

const BASE = "https://business-api.tiktok.com/open_api/v1.3"

export const TIKTOK_AUTH_PORTAL = "https://business-api.tiktok.com/portal/auth"
export const TIKTOK_TOKEN_URL = `${BASE}/oauth2/access_token/`

export type TikTokCredentials = {
  accessToken: string
  advertiserId: string
}

export class TikTokError extends Error {}

export function appId() {
  return process.env.TIKTOK_APP_ID
}

export function appSecret() {
  return process.env.TIKTOK_APP_SECRET
}

function digitsOnly(value: string | null | undefined): string {
  return (value || "").replace(/\D/g, "")
}

export function isConfigured(credentials?: TikTokCredentials | null): boolean {
  return Boolean(credentials?.accessToken && credentials.advertiserId)
}

export async function getTikTokCredentials(userId: string): Promise<TikTokCredentials | null> {
  const integration = await getUserIntegration(userId, "tiktok_ads")
  const secrets = await getIntegrationSecrets(userId, "tiktok_ads")
  const advertiserId = digitsOnly(integration?.providerAccountId)

  if (secrets?.accessToken && advertiserId) return { accessToken: secrets.accessToken, advertiserId }
  return null
}

export function advertiserId(credentials?: TikTokCredentials | null): string {
  return digitsOnly(credentials?.advertiserId)
}

export async function tiktok(
  path: string,
  params: Record<string, unknown> = {},
  credentials?: TikTokCredentials | null,
): Promise<any> {
  if (!credentials?.accessToken) {
    throw new TikTokError("Credenciais do TikTok não configuradas")
  }

  const url = new URL(`${BASE}${path}`)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v))
  }
  const res = await fetch(url.toString(), {
    headers: { "Access-Token": credentials.accessToken },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  if (data.code !== 0) {
    throw new TikTokError(data.message || `Erro ${res.status} na TikTok API`)
  }
  return data.data
}

export function num(v: unknown): number {
  return Number(v ?? 0)
}

export function dateRange(days: number, offsetDays = 0): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1 - offsetDays)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return { start: fmt(start), end: fmt(end) }
}

export function ttDate(value: string): string {
  if (!value || value.length < 10) return value
  return `${value.slice(8, 10)}/${value.slice(5, 7)}`
}

export function translateStatus(s: string): string {
  switch (s) {
    case "CAMPAIGN_STATUS_ENABLE":
    case "ENABLE":
      return "Ativo"
    case "CAMPAIGN_STATUS_DISABLE":
    case "DISABLE":
      return "Pausado"
    case "CAMPAIGN_STATUS_DELETE":
    case "DELETE":
      return "Excluído"
    default:
      return s || "-"
  }
}
