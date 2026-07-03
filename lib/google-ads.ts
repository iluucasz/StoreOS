import { getIntegrationSecrets, getUserIntegration } from "@/lib/integrations/store"

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const API_HOST = "https://googleads.googleapis.com"
const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v20"

export const ADS_SCOPE = "https://www.googleapis.com/auth/adwords"

export type GoogleAdsRow = Record<string, any>

export type GoogleAdsCredentials = {
  clientId: string
  clientSecret: string
  developerToken: string
  refreshToken: string
  customerId: string
  loginCustomerId?: string
}

export type GoogleAdsOAuthCredentials = Omit<GoogleAdsCredentials, "customerId">

export class GoogleAdsError extends Error {}

function digitsOnly(id: string | undefined | null): string {
  return (id || "").replace(/\D/g, "")
}

function oauthErrorMessage(data: any): string {
  if (data?.error === "invalid_grant") {
    return (
      "Refresh token do Google Ads inválido, expirado ou revogado. " +
      "Conecte novamente com o Google para renovar a autorização."
    )
  }

  if (data?.error === "invalid_client") {
    return "Client ID ou Client Secret do Google Ads inválido. Confira as credenciais do OAuth client no Google Cloud."
  }

  return data.error_description || data.error || "Falha ao renovar o access token OAuth"
}

export function clientId(): string | undefined {
  return process.env.GOOGLE_ADS_CLIENT_ID
}

export function clientSecret(): string | undefined {
  return process.env.GOOGLE_ADS_CLIENT_SECRET
}

export function developerToken(): string | undefined {
  return process.env.GOOGLE_ADS_DEVELOPER_TOKEN
}

export function isConfigured(credentials?: GoogleAdsCredentials | null): boolean {
  return Boolean(
    credentials?.clientId &&
      credentials.clientSecret &&
      credentials.developerToken &&
      credentials.refreshToken &&
      credentials.customerId,
  )
}

export async function getGoogleAdsCredentials(userId: string): Promise<GoogleAdsCredentials | null> {
  const id = clientId()
  const secret = clientSecret()
  const devToken = developerToken()
  const integration = await getUserIntegration(userId, "google_ads")
  const secrets = await getIntegrationSecrets(userId, "google_ads")
  const customerId = digitsOnly(integration?.providerAccountId)
  const settings = (integration?.settings ?? {}) as { loginCustomerId?: string }
  const loginCustomerId = digitsOnly(settings.loginCustomerId)

  if (id && secret && devToken && secrets?.refreshToken && customerId) {
    return { clientId: id, clientSecret: secret, developerToken: devToken, refreshToken: secrets.refreshToken, customerId, loginCustomerId }
  }

  return null
}

export async function getGoogleAdsOAuthCredentials(userId: string): Promise<GoogleAdsOAuthCredentials | null> {
  const id = clientId()
  const secret = clientSecret()
  const devToken = developerToken()
  const integration = await getUserIntegration(userId, "google_ads")
  const secrets = await getIntegrationSecrets(userId, "google_ads")
  const settings = (integration?.settings ?? {}) as { loginCustomerId?: string }
  const loginCustomerId = digitsOnly(settings.loginCustomerId)

  if (id && secret && devToken && secrets?.refreshToken) {
    return { clientId: id, clientSecret: secret, developerToken: devToken, refreshToken: secrets.refreshToken, loginCustomerId }
  }

  return null
}

async function getAccessToken(credentials: GoogleAdsOAuthCredentials | GoogleAdsCredentials): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new GoogleAdsError(oauthErrorMessage(data))
  }
  return data.access_token as string
}

export async function listAccessibleCustomers(credentials: GoogleAdsOAuthCredentials): Promise<string[]> {
  const accessToken = await getAccessToken(credentials)
  const res = await fetch(`${API_HOST}/${API_VERSION}/customers:listAccessibleCustomers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": credentials.developerToken,
    },
    cache: "no-store",
  })
  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new GoogleAdsError(payload?.error?.message || "Não foi possível listar contas do Google Ads.")
  }
  return (payload.resourceNames || []).map((name: string) => digitsOnly(name))
}

export async function runQuery(query: string, credentials?: GoogleAdsCredentials | null): Promise<GoogleAdsRow[]> {
  if (!credentials || !isConfigured(credentials)) {
    throw new GoogleAdsError("Credenciais do Google Ads não configuradas")
  }

  const accessToken = await getAccessToken(credentials)
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": credentials.developerToken,
    "Content-Type": "application/json",
  }
  if (credentials.loginCustomerId) headers["login-customer-id"] = credentials.loginCustomerId

  const res = await fetch(
    `${API_HOST}/${API_VERSION}/customers/${digitsOnly(credentials.customerId)}/googleAds:searchStream`,
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
    let apiError =
      payload?.[0]?.error?.details?.[0]?.errors?.[0]?.message ||
      payload?.[0]?.error?.message ||
      payload?.error?.message ||
      (typeof payload === "string" ? payload : "Erro desconhecido na Google Ads API")
    if (/manager account/i.test(apiError)) {
      apiError =
        "A conta selecionada é uma conta administradora (MCC), que não tem métricas próprias. " +
        "Selecione uma conta de anúncios cliente e use a MCC como login customer ID."
    }
    throw new GoogleAdsError(apiError)
  }

  const batches: any[] = Array.isArray(payload) ? payload : [payload]
  return batches.flatMap((b) => b?.results ?? [])
}

export function fromMicros(micros: string | number | undefined): number {
  return Number(micros ?? 0) / 1_000_000
}

export function num(v: string | number | undefined): number {
  return Number(v ?? 0)
}

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

export function dateRange(days: number, offsetDays = 0): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1 - offsetDays)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  return { start: fmt(start), end: fmt(end) }
}
