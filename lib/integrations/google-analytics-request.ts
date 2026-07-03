import { getCurrentUser } from "@/lib/auth"
import { getGoogleAnalyticsCredentials, isConfigured, type GoogleAnalyticsCredentials } from "@/lib/google-analytics"

export async function getGoogleAnalyticsRequestCredentials(): Promise<GoogleAnalyticsCredentials | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const credentials = await getGoogleAnalyticsCredentials(user.id)
  return credentials && isConfigured(credentials) ? credentials : null
}
