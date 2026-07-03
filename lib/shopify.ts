import { getIntegrationSecrets, getUserIntegration } from "@/lib/integrations/store"

export const SHOPIFY_SCOPES = "read_customers,read_inventory,read_orders,read_products"
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01"

export type ShopifyCredentials = {
  shop: string
  accessToken: string
}

export class ShopifyError extends Error {}

export function clientId(): string | undefined {
  return process.env.SHOPIFY_CLIENT_ID
}

export function clientSecret(): string | undefined {
  return process.env.SHOPIFY_CLIENT_SECRET
}

export function normalizeShopDomain(value: string | null | undefined): string {
  const raw = (value || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
  if (!raw) return ""
  return raw.endsWith(".myshopify.com") ? raw : `${raw}.myshopify.com`
}

export function isConfigured(credentials?: ShopifyCredentials | null): boolean {
  return Boolean(credentials?.shop && credentials.accessToken)
}

export async function getShopifyCredentials(userId: string): Promise<ShopifyCredentials | null> {
  const integration = await getUserIntegration(userId, "shopify")
  const secrets = await getIntegrationSecrets(userId, "shopify")
  const shop = normalizeShopDomain(integration?.providerAccountId)

  if (shop && secrets?.accessToken) return { shop, accessToken: secrets.accessToken }
  return null
}

export async function shopifyFetch<T>(
  credentials: ShopifyCredentials,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://${credentials.shop}/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": credentials.accessToken,
      ...(init?.headers || {}),
    },
    cache: init?.cache ?? "no-store",
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ShopifyError(`Shopify retornou erro ${response.status}.`)
  }

  return json as T
}
