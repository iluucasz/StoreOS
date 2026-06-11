import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { sql, eq, and, asc, desc } from "drizzle-orm"
import * as schema from "./db/schema"
import { chatSessions, chatMessages } from "./db/schema"

const client = neon(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })
export { schema }

// ─── IA chat persistence ──────────────────────────────────────────────────
let schemaReady = false

/** Lazily ensure the chat tables exist (idempotent, runs once per process). */
export async function initSchema() {
  if (schemaReady) return
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_role') THEN
        CREATE TYPE chat_role AS ENUM ('user', 'assistant');
      END IF;
    END $$;
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
  await db.execute(sql`
    ALTER TABLE chat_sessions
      ADD COLUMN IF NOT EXISTS title text
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id bigserial PRIMARY KEY,
      session_id text NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role chat_role NOT NULL,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS chat_messages_session_idx
      ON chat_messages (session_id, created_at)
  `)
  schemaReady = true
}

/** Append a chat message, creating the session row on first use. */
export async function saveMessage(
  sessionId: string,
  userId: string,
  role: "user" | "assistant",
  content: string,
) {
  await db.insert(chatSessions).values({ id: sessionId, userId }).onConflictDoNothing()
  await db.insert(chatMessages).values({ sessionId, userId, role, content })
}

/** Return the most recent `limit` messages for a session, in chronological order. */
export async function getHistory(sessionId: string, limit = 10) {
  const rows = await db
    .select({ role: chatMessages.role, content: chatMessages.content })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit)
  return rows.reverse()
}

export type ChatSessionSummary = { id: string; title: string; lastAt: string; count: number }

/** Lista as conversas do usuário (título = 1ª mensagem do usuário). */
export async function listSessions(userId: string): Promise<ChatSessionSummary[]> {
  const rows = await db
    .select({
      id: chatMessages.sessionId,
      title: sql<string>`coalesce(
        max(${chatSessions.title}),
        (array_agg(${chatMessages.content} ORDER BY ${chatMessages.createdAt} ASC)
          FILTER (WHERE ${chatMessages.role} = 'user'))[1]
      )`,
      lastAt: sql<string>`to_char(max(${chatMessages.createdAt}) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`,
      count: sql<number>`count(*)::int`,
    })
    .from(chatMessages)
    .leftJoin(chatSessions, eq(chatSessions.id, chatMessages.sessionId))
    .where(eq(chatMessages.userId, userId))
    .groupBy(chatMessages.sessionId)
    .orderBy(desc(sql`max(${chatMessages.createdAt})`))
    .limit(100)
  return rows.map((r) => ({ ...r, title: r.title || "Nova conversa" }))
}

/** Mensagens de uma conversa, em ordem cronológica (escopo do usuário). */
export async function getSessionMessages(sessionId: string, userId: string) {
  return db
    .select({ role: chatMessages.role, content: chatMessages.content })
    .from(chatMessages)
    .where(and(eq(chatMessages.sessionId, sessionId), eq(chatMessages.userId, userId)))
    .orderBy(asc(chatMessages.createdAt))
}

/** Exclui uma conversa (cascateia as mensagens). */
export async function deleteSession(sessionId: string, userId: string) {
  await db.delete(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
}

/** Renomeia uma conversa do usuário. */
export async function renameSession(sessionId: string, userId: string, title: string) {
  const rows = await db
    .update(chatSessions)
    .set({ title })
    .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
    .returning({ id: chatSessions.id })
  return rows.length > 0
}

/** Exclui todas as conversas do usuário. */
export async function clearSessions(userId: string) {
  await db.delete(chatSessions).where(eq(chatSessions.userId, userId))
}
