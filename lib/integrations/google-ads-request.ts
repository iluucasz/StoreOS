import { getCurrentUser } from "@/lib/auth"
import { getGoogleAdsCredentials, isConfigured, type GoogleAdsCredentials } from "@/lib/google-ads"

export async function getGoogleAdsRequestCredentials(): Promise<GoogleAdsCredentials | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const credentials = await getGoogleAdsCredentials(user.id)
  return credentials && isConfigured(credentials) ? credentials : null
}
