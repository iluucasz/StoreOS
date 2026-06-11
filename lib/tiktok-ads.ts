/**
 * Cliente mínimo da TikTok Marketing API (Business API).
 * Credenciais via `.env.local`:
 *   TIKTOK_APP_ID         — App ID (TikTok for Business / developers.tiktok.com)
 *   TIKTOK_APP_SECRET     — Secret do app (usado no fluxo OAuth)
 *   TIKTOK_ACCESS_TOKEN   — token de acesso (gerado em /api/tiktok-ads/auth)
 *   TIKTOK_ADVERTISER_ID  — ID do anunciante (advertiser_id)
 */

const BASE = "https://business-api.tiktok.com/open_api/v1.3"

/** URL do portal de autorização do TikTok for Business. */
export const TIKTOK_AUTH_PORTAL = "https://business-api.tiktok.com/portal/auth"
export const TIKTOK_TOKEN_URL = `${BASE}/oauth2/access_token/`

export class TikTokError extends Error {}

export function appId() {
  return process.env.TIKTOK_APP_ID
}
export function appSecret() {
  return process.env.TIKTOK_APP_SECRET
}
export function advertiserId(): string {
  return (process.env.TIKTOK_ADVERTISER_ID || "").replace(/\D/g, "")
}

export function isConfigured(): boolean {
  return Boolean(process.env.TIKTOK_ACCESS_TOKEN && advertiserId())
}

/** GET genérico na Business API. Arrays viram JSON; demais valores, string. */
export async function tiktok(path: string, params: Record<string, unknown> = {}): Promise<any> {
  if (!process.env.TIKTOK_ACCESS_TOKEN) {
    throw new TikTokError("Credenciais do TikTok não configuradas")
  }
  const url = new URL(`${BASE}${path}`)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v))
  }
  const res = await fetch(url.toString(), {
    headers: { "Access-Token": process.env.TIKTOK_ACCESS_TOKEN },
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

/** Datas YYYY-MM-DD para os últimos `days` dias, terminando ontem. */
export function dateRange(days: number, offsetDays = 0): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1 - offsetDays)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return { start: fmt(start), end: fmt(end) }
}

/** "2026-06-01 00:00:00" → "DD/MM". */
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
