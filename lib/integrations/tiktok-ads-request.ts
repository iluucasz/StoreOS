import { getCurrentUser } from "@/lib/auth"
import { getTikTokCredentials, isConfigured, type TikTokCredentials } from "@/lib/tiktok-ads"

export async function getTikTokRequestCredentials(): Promise<TikTokCredentials | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const credentials = await getTikTokCredentials(user.id)
  return credentials && isConfigured(credentials) ? credentials : null
}
