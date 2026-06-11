/**
 * Cliente mínimo da Google Ads API (REST), seguindo o mesmo padrão da
 * integração Shopify: credenciais via variáveis de ambiente em `.env.local`.
 *
 * Variáveis necessárias:
 *   GOOGLE_ADS_CLIENT_ID          — OAuth client ID (Google Cloud Console)
 *   GOOGLE_ADS_CLIENT_SECRET      — OAuth client secret
 *   GOOGLE_ADS_DEVELOPER_TOKEN    — Developer token (aprovado no Google Ads API Center)
 *   GOOGLE_ADS_REFRESH_TOKEN      — Refresh token OAuth (gerado em /api/google-ads/auth)
 *   GOOGLE_ADS_CUSTOMER_ID        — ID da conta a consultar (10 dígitos, sem traços)
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID  — (opcional) ID da conta gerenciadora MCC, sem traços
 *   GOOGLE_ADS_API_VERSION        — (opcional) versão da API, padrão "v20"
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const API_HOST = "https://googleads.googleapis.com"
const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v20"

/** Escopo OAuth necessário para a Google Ads API. */
export const ADS_SCOPE = "https://www.googleapis.com/auth/adwords"

export type GoogleAdsRow = Record<string, any>

/** Erro com mensagem legível vinda da API (para exibir no front). */
export class GoogleAdsError extends Error {}

/** True quando todas as credenciais obrigatórias estão presentes. */
export function isConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_CLIENT_ID &&
      process.env.GOOGLE_ADS_CLIENT_SECRET &&
      process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID,
  )
}

/** Customer ID apenas com dígitos (a API não aceita traços). */
function digitsOnly(id: string | undefined): string {
  return (id || "").replace(/\D/g, "")
}

/** Troca o refresh token por um access token de curta duração. */
async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new GoogleAdsError(
      data.error_description || data.error || "Falha ao renovar o access token OAuth",
    )
  }
  return data.access_token as string
}

/**
 * Executa uma query GAQL e retorna todas as linhas (achatando os lotes do
 * endpoint searchStream).
 */
export async function runQuery(query: string): Promise<GoogleAdsRow[]> {
  if (!isConfigured()) {
    throw new GoogleAdsError("Credenciais do Google Ads não configuradas")
  }

  const accessToken = await getAccessToken()
  const customerId = digitsOnly(process.env.GOOGLE_ADS_CUSTOMER_ID)
  const loginCustomerId = digitsOnly(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId

  const res = await fetch(
    `${API_HOST}/${API_VERSION}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      cache: "no-store",
    },
  )

  const text = await res.text()
  let payload: any
  try {
    payload = JSON.parse(text)
  } catch {
    payload = text
  }

  if (!res.ok) {
    const apiError =
      payload?.[0]?.error?.message ||
      payload?.error?.message ||
      (typeof payload === "string" ? payload : "Erro desconhecido na Google Ads API")
    throw new GoogleAdsError(apiError)
  }

  // searchStream devolve um array de lotes: [{ results: [...] }, ...]
  const batches: any[] = Array.isArray(payload) ? payload : [payload]
  return batches.flatMap((b) => b?.results ?? [])
}

// ─── Helpers numéricos ───────────────────────────────────────────────────────

/** Converte micros (1/1.000.000) para a moeda da conta. */
export function fromMicros(micros: string | number | undefined): number {
  return Number(micros ?? 0) / 1_000_000
}

export function num(v: string | number | undefined): number {
  return Number(v ?? 0)
}

// ─── Tradução de enums para PT-BR ────────────────────────────────────────────

export function translateStatus(status: string | undefined): string {
  switch (status) {
    case "ENABLED":
      return "Ativa"
    case "PAUSED":
      return "Pausada"
    case "REMOVED":
      return "Removida"
    default:
      return status || "-"
  }
}

export function translateMatchType(matchType: string | undefined): string {
  switch (matchType) {
    case "EXACT":
      return "Exata"
    case "PHRASE":
      return "Frase"
    case "BROAD":
      return "Ampla"
    default:
      return matchType || "-"
  }
}

export function translateConversionCategory(category: string | undefined): string {
  switch (category) {
    case "PURCHASE":
    case "DEFAULT":
      return "Transação"
    case "LEAD":
    case "SUBMIT_LEAD_FORM":
    case "SIGNUP":
      return "Lead"
    case "PAGE_VIEW":
    case "ENGAGEMENT":
    case "DOWNLOAD":
      return "Engajamento"
    default:
      return category || "Outro"
  }
}

/** Janela de datas (YYYY-MM-DD) para os últimos `days` dias, terminando ontem. */
export function dateRange(days: number, offsetDays = 0): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1 - offsetDays)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return { start: fmt(start), end: fmt(end) }
}
