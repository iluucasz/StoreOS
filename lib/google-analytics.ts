/**
 * Cliente mínimo da Google Analytics Data API (GA4), no mesmo padrão da
 * integração Google Ads. Diferente do Google Ads, o GA4 NÃO exige developer
 * token nem aprovação — basta OAuth + a API ativada + acesso à propriedade.
 *
 * Variáveis (.env.local):
 *   GOOGLE_ANALYTICS_PROPERTY_ID   — ID numérico da propriedade GA4 (ex.: 123456789)
 *   GOOGLE_ANALYTICS_REFRESH_TOKEN — refresh token OAuth (gerado em /api/google-analytics/auth)
 *   GOOGLE_ANALYTICS_CLIENT_ID     — (opcional) reutiliza GOOGLE_ADS_CLIENT_ID se ausente
 *   GOOGLE_ANALYTICS_CLIENT_SECRET — (opcional) reutiliza GOOGLE_ADS_CLIENT_SECRET se ausente
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const DATA_API = "https://analyticsdata.googleapis.com/v1beta"

/** Escopo OAuth para leitura do Google Analytics. */
export const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"

export class GoogleAnalyticsError extends Error {}

/** O OAuth client é o mesmo do Google Ads (mesmo projeto no Google Cloud). */
export function clientId(): string | undefined {
  return process.env.GOOGLE_ANALYTICS_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID
}
export function clientSecret(): string | undefined {
  return process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET
}

export function propertyId(): string {
  return (process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "").replace(/\D/g, "")
}

export function isConfigured(): boolean {
  return Boolean(
    clientId() && clientSecret() && process.env.GOOGLE_ANALYTICS_REFRESH_TOKEN && propertyId(),
  )
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId()!,
      client_secret: clientSecret()!,
      refresh_token: process.env.GOOGLE_ANALYTICS_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new GoogleAnalyticsError(
      data.error_description || data.error || "Falha ao renovar o access token OAuth",
    )
  }
  return data.access_token as string
}

async function callApi(method: "runReport" | "runRealtimeReport", body: object): Promise<any> {
  if (!isConfigured()) {
    throw new GoogleAnalyticsError("Credenciais do Google Analytics não configuradas")
  }
  const token = await getAccessToken()
  const res = await fetch(`${DATA_API}/properties/${propertyId()}:${method}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const text = await res.text()
  let payload: any
  try {
    payload = JSON.parse(text)
  } catch {
    payload = text
  }
  if (!res.ok) {
    const msg = payload?.error?.message || (typeof payload === "string" ? payload : "Erro na GA4 Data API")
    throw new GoogleAnalyticsError(msg)
  }
  return payload
}

export function runReport(body: object) {
  return callApi("runReport", body)
}
export function runRealtimeReport(body: object) {
  return callApi("runRealtimeReport", body)
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

/** Converte a resposta do GA4 em um array de objetos { dimensão|métrica: valor }. */
export function parseRows(resp: any): Record<string, any>[] {
  const dimHeaders: string[] = (resp.dimensionHeaders || []).map((h: any) => h.name)
  const metHeaders: string[] = (resp.metricHeaders || []).map((h: any) => h.name)
  return (resp.rows || []).map((row: any) => {
    const obj: Record<string, any> = {}
    ;(row.dimensionValues || []).forEach((d: any, i: number) => {
      obj[dimHeaders[i]] = d.value
    })
    ;(row.metricValues || []).forEach((m: any, i: number) => {
      obj[metHeaders[i]] = Number(m.value ?? 0)
    })
    return obj
  })
}

/** Primeira linha (para relatórios agregados sem dimensões). */
export function firstRow(resp: any): Record<string, any> {
  return parseRows(resp)[0] || {}
}

export function num(v: unknown): number {
  return Number(v ?? 0)
}

/** Converte a data "YYYYMMDD" do GA4 para "DD/MM". */
export function gaDate(value: string): string {
  if (!value || value.length !== 8) return value
  return `${value.slice(6, 8)}/${value.slice(4, 6)}`
}

/** Variação percentual arredondada entre período atual e anterior. */
export function pct(curr: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

// ─── Tradução de valores do GA4 para PT-BR ───────────────────────────────────

const CHANNEL_PT: Record<string, string> = {
  Direct: "Direto",
  "Organic Search": "Busca Orgânica",
  "Paid Search": "Busca Paga",
  "Organic Social": "Social Orgânico",
  "Paid Social": "Social Pago",
  "Organic Shopping": "Shopping Orgânico",
  "Paid Shopping": "Shopping Pago",
  "Organic Video": "Vídeo Orgânico",
  "Paid Video": "Vídeo Pago",
  Display: "Display",
  Email: "Email",
  Affiliates: "Afiliados",
  Referral: "Referência",
  Audio: "Áudio",
  SMS: "SMS",
  "Mobile Push Notifications": "Notificações Push",
  "Cross-network": "Entre redes",
  Unassigned: "Não atribuído",
}

/** Traduz o nome do grupo de canal padrão do GA4. */
export function translateChannel(name: string): string {
  return CHANNEL_PT[name] || name
}

const TOKEN_PT: Record<string, string> = {
  "(not set)": "(não definido)",
  "(direct)": "(direto)",
  "(organic)": "(orgânico)",
  "(referral)": "(referência)",
  "(none)": "(nenhum)",
  "(data not available)": "(dados indisponíveis)",
}

/** Traduz os tokens padrão do GA4 (ex.: "(organic)") mantendo nomes próprios. */
export function translateToken(name: string): string {
  return TOKEN_PT[name] || name
}
