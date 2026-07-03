import { getIntegrationSecrets, getUserIntegration } from "@/lib/integrations/store"

const GRAPH = "https://graph.facebook.com"
const API_VERSION = process.env.META_API_VERSION || "v21.0"

export const META_SCOPE = "ads_read"

export type MetaCredentials = {
  accessToken: string
  adAccountId: string
}

export class MetaError extends Error {}

export function appId() {
  return process.env.META_APP_ID
}

export function appSecret() {
  return process.env.META_APP_SECRET
}

export function apiVersion() {
  return API_VERSION
}

function normalizeAccountId(value: string | null | undefined): string {
  const raw = (value || "").trim()
  if (!raw) return ""
  return raw.startsWith("act_") ? raw : `act_${raw.replace(/\D/g, "")}`
}

export function isConfigured(credentials?: MetaCredentials | null): boolean {
  return Boolean(credentials?.accessToken && credentials.adAccountId)
}

export async function getMetaCredentials(userId: string): Promise<MetaCredentials | null> {
  const integration = await getUserIntegration(userId, "meta_ads")
  const secrets = await getIntegrationSecrets(userId, "meta_ads")
  const adAccountId = normalizeAccountId(integration?.providerAccountId)

  if (secrets?.accessToken && adAccountId) return { accessToken: secrets.accessToken, adAccountId }
  return null
}

export function accountId(credentials?: MetaCredentials | null): string {
  return normalizeAccountId(credentials?.adAccountId)
}

export async function graph(
  path: string,
  params: Record<string, string> = {},
  credentials?: MetaCredentials | null,
): Promise<any> {
  if (!credentials?.accessToken) {
    throw new MetaError("Credenciais da Meta não configuradas")
  }

  const url = new URL(`${GRAPH}/${API_VERSION}/${path}`)
  url.searchParams.set("access_token", credentials.accessToken)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), { cache: "no-store" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) {
    throw new MetaError(data.error?.message || `Erro ${res.status} na Graph API`)
  }
  return data
}

export function timeRange(days: number, offsetDays = 0): string {
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const until = new Date()
  until.setUTCDate(until.getUTCDate() - 1 - offsetDays)
  const since = new Date(until)
  since.setUTCDate(since.getUTCDate() - (days - 1))
  return JSON.stringify({ since: fmt(since), until: fmt(until) })
}

type MetaAction = { action_type: string; value: string }

export function findAction(actions: MetaAction[] | undefined, types: string[]): number {
  if (!actions) return 0
  for (const t of types) {
    const a = actions.find((x) => x.action_type === t)
    if (a) return Number(a.value || 0)
  }
  return 0
}

export const PURCHASE = ["omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase"]
export const ADD_TO_CART = ["omni_add_to_cart", "add_to_cart", "offsite_conversion.fb_pixel_add_to_cart"]
export const CHECKOUT = ["omni_initiated_checkout", "initiate_checkout", "offsite_conversion.fb_pixel_initiate_checkout"]
export const VIEW_CONTENT = ["omni_view_content", "view_content", "offsite_conversion.fb_pixel_view_content"]
export const LEAD = ["omni_lead", "lead", "offsite_conversion.fb_pixel_lead"]

export function num(v: unknown): number {
  return Number(v ?? 0)
}

export function ddmm(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return isoDate
  return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`
}

export function translatePlatform(p: string): string {
  switch (p) {
    case "facebook":
      return "Facebook"
    case "instagram":
      return "Instagram"
    case "audience_network":
      return "Audience Network"
    case "messenger":
      return "Messenger"
    default:
      return p
  }
}

export function translateStatus(s: string): string {
  switch (s) {
    case "ACTIVE":
      return "Ativo"
    case "PAUSED":
      return "Pausado"
    case "DELETED":
    case "ARCHIVED":
      return "Arquivado"
    case "IN_PROCESS":
    case "PENDING_REVIEW":
      return "Em revisão"
    default:
      return s
  }
}
