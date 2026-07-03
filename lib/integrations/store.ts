import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { userIntegrations, type DBUserIntegration } from "@/lib/db/schema"
import { decryptSecret, encryptSecret } from "@/lib/security/encryption"

export type IntegrationProvider = DBUserIntegration["provider"]
export type IntegrationStatus = DBUserIntegration["status"]

export type IntegrationSecrets = {
  accessToken?: string | null
  refreshToken?: string | null
}

export type SaveIntegrationInput = {
  userId: string
  provider: IntegrationProvider
  status?: IntegrationStatus
  providerAccountId?: string | null
  accountName?: string | null
  accessToken?: string | null
  refreshToken?: string | null
  tokenType?: string | null
  scope?: string | null
  expiresAt?: Date | null
  metadata?: Record<string, unknown>
  settings?: Record<string, unknown>
  lastError?: string | null
}

export async function getUserIntegration(userId: string, provider: IntegrationProvider) {
  const rows = await db
    .select()
    .from(userIntegrations)
    .where(and(eq(userIntegrations.userId, userId), eq(userIntegrations.provider, provider)))
    .limit(1)

  return rows[0] ?? null
}

export async function getIntegrationSecrets(userId: string, provider: IntegrationProvider): Promise<IntegrationSecrets | null> {
  const integration = await getUserIntegration(userId, provider)
  if (!integration) return null

  return {
    accessToken: decryptSecret(integration.accessToken),
    refreshToken: decryptSecret(integration.refreshToken),
  }
}

export async function saveUserIntegration(input: SaveIntegrationInput) {
  const now = new Date()
  const values = {
    userId: input.userId,
    provider: input.provider,
    status: input.status ?? "connected",
    providerAccountId: input.providerAccountId ?? null,
    accountName: input.accountName ?? null,
    accessToken: encryptSecret(input.accessToken),
    refreshToken: encryptSecret(input.refreshToken),
    tokenType: input.tokenType ?? null,
    scope: input.scope ?? null,
    expiresAt: input.expiresAt ?? null,
    metadata: input.metadata ?? {},
    settings: input.settings ?? {},
    lastError: input.lastError ?? null,
    connectedAt: now,
    updatedAt: now,
  }

  const rows = await db
    .insert(userIntegrations)
    .values(values)
    .onConflictDoUpdate({
      target: [userIntegrations.userId, userIntegrations.provider],
      set: {
        status: values.status,
        providerAccountId: values.providerAccountId,
        accountName: values.accountName,
        accessToken: values.accessToken,
        refreshToken: values.refreshToken,
        tokenType: values.tokenType,
        scope: values.scope,
        expiresAt: values.expiresAt,
        metadata: values.metadata,
        settings: values.settings,
        lastError: values.lastError,
        connectedAt: values.connectedAt,
        updatedAt: values.updatedAt,
      },
    })
    .returning()

  return rows[0]
}

export async function markIntegrationError(userId: string, provider: IntegrationProvider, lastError: string) {
  await db
    .update(userIntegrations)
    .set({ status: "error", lastError, updatedAt: new Date() })
    .where(and(eq(userIntegrations.userId, userId), eq(userIntegrations.provider, provider)))
}
