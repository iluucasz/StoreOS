import { getCurrentUser } from "@/lib/auth"
import { getShopifyCredentials, isConfigured, type ShopifyCredentials } from "@/lib/shopify"

export async function getShopifyRequestCredentials(): Promise<ShopifyCredentials | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const credentials = await getShopifyCredentials(user.id)
  return credentials && isConfigured(credentials) ? credentials : null
}
