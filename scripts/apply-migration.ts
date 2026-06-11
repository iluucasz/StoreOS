import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL_UNPOOLED!)

async function main() {
  // Drop legacy chat_messages from the old initSchema (conflicts with new schema)
  console.log("Dropping legacy chat_messages if present...")
  await sql`DROP TABLE IF EXISTS chat_messages CASCADE`

  const dir = join(process.cwd(), "drizzle")
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()

  for (const file of files) {
    console.log(`Applying ${file}...`)
    const content = readFileSync(join(dir, file), "utf8")
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean)

    for (const stmt of statements) {
      try {
        await sql.query(stmt)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes("already exists")) {
          console.log(`  skip (exists): ${stmt.slice(0, 50)}...`)
        } else {
          throw e
        }
      }
    }
  }

  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
  console.log(`\nDone. ${tables.length} tables:`)
  console.log(tables.map((t: Record<string, unknown>) => t.table_name).join(", "))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
