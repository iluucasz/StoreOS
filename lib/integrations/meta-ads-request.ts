import { getCurrentUser } from "@/lib/auth"
import { getMetaCredentials, isConfigured, type MetaCredentials } from "@/lib/meta-ads"

export async function getMetaRequestCredentials(): Promise<MetaCredentials | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const credentials = await getMetaCredentials(user.id)
  return credentials && isConfigured(credentials) ? credentials : null
}
