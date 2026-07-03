import { getIntegrationSecrets, getUserIntegration } from "@/lib/integrations/store"

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const DATA_API = "https://analyticsdata.googleapis.com/v1beta"

export const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly"

export class GoogleAnalyticsError extends Error {}

export type GoogleAnalyticsCredentials = {
  clientId: string
  clientSecret: string
  refreshToken: string
  propertyId: string
}

function oauthErrorMessage(data: any): string {
  if (data?.error === "invalid_grant") {
    return (
      "Refresh token do Google Analytics inválido, expirado ou revogado. " +
      "Conecte novamente com o Google para renovar a autorização. " +
      "Se o app OAuth estiver em modo de teste, publique o app ou adicione o usuário como testador."
    )
  }

  if (data?.error === "invalid_client") {
    return "Client ID ou Client Secret do Google Analytics inválido. Confira as credenciais do OAuth client no Google Cloud."
  }

  return data.error_description || data.error || "Falha ao renovar o access token OAuth"
}

export function clientId(): string | undefined {
  return process.env.GOOGLE_ANALYTICS_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID
}

export function clientSecret(): string | undefined {
  return process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET
}

export function propertyId(credentials?: Pick<GoogleAnalyticsCredentials, "propertyId">): string {
  return (credentials?.propertyId || "").replace(/\D/g, "")
}

export function isConfigured(credentials?: GoogleAnalyticsCredentials | null): boolean {
  return Boolean(credentials?.clientId && credentials.clientSecret && credentials.refreshToken && credentials.propertyId)
}

export async function getGoogleAnalyticsCredentials(userId: string): Promise<GoogleAnalyticsCredentials | null> {
  const id = clientId()
  const secret = clientSecret()
  const integration = await getUserIntegration(userId, "google_analytics")
  const secrets = await getIntegrationSecrets(userId, "google_analytics")
  const integrationPropertyId = (integration?.providerAccountId || "").replace(/\D/g, "")

  if (id && secret && secrets?.refreshToken && integrationPropertyId) {
    return {
      clientId: id,
      clientSecret: secret,
      refreshToken: secrets.refreshToken,
      propertyId: integrationPropertyId,
    }
  }

  return null
}

async function getAccessToken(credentials?: GoogleAnalyticsCredentials | null): Promise<string> {
  if (!isConfigured(credentials)) {
    throw new GoogleAnalyticsError("Credenciais do Google Analytics não configuradas")
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials!.clientId,
      client_secret: credentials!.clientSecret,
      refresh_token: credentials!.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new GoogleAnalyticsError(oauthErrorMessage(data))
  }
  return data.access_token as string
}

async function callApi(
  method: "runReport" | "runRealtimeReport",
  body: object,
  credentials?: GoogleAnalyticsCredentials | null,
): Promise<any> {
  if (!credentials || !isConfigured(credentials)) {
    throw new GoogleAnalyticsError("Credenciais do Google Analytics não configuradas")
  }

  const token = await getAccessToken(credentials)
  const res = await fetch(`${DATA_API}/properties/${propertyId(credentials)}:${method}`, {
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

export function runReport(body: object, credentials?: GoogleAnalyticsCredentials | null) {
  return callApi("runReport", body, credentials)
}

export function runRealtimeReport(body: object, credentials?: GoogleAnalyticsCredentials | null) {
  return callApi("runRealtimeReport", body, credentials)
}

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

export function firstRow(resp: any): Record<string, any> {
  return parseRows(resp)[0] || {}
}

export function num(v: unknown): number {
  return Number(v ?? 0)
}

export function gaDate(value: string): string {
  if (!value || value.length !== 8) return value
  return `${value.slice(6, 8)}/${value.slice(4, 6)}`
}

export function pct(curr: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

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

export function translateToken(name: string): string {
  return TOKEN_PT[name] || name
}
