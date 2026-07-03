import { eq } from "drizzle-orm"
import * as meta from "@/lib/meta-ads"
import * as ga from "@/lib/google-analytics"
import { db } from "@/lib/db"
import { promotions } from "@/lib/db/schema"

export async function fetchMarketingContext(userId: string): Promise<string> {
  const [metaBlock, gaBlock, promoBlock] = await Promise.all([metaSummary(userId), gaSummary(userId), promoSummary(userId)])

  return [
    "DADOS DE MARKETING, TRÁFEGO E PROMOÇÕES (use para verificar hipóteses, não apenas para indicar telas):",
    metaBlock,
    gaBlock,
    promoBlock,
  ].join("\n")
}

async function metaSummary(userId: string): Promise<string> {
  const credentials = await meta.getMetaCredentials(userId)

  if (!meta.isConfigured(credentials)) {
    return "- Meta Ads (Facebook/Instagram): não conectado (sem investimento em anúncios rastreado por aqui)."
  }

  try {
    const acc = meta.accountId(credentials)
    const [ins, camps] = await Promise.all([
      meta.graph(
        `${acc}/insights`,
        {
          fields: "spend,impressions,clicks,actions,action_values",
          time_range: meta.timeRange(7, 0),
        },
        credentials,
      ),
      meta.graph(`${acc}/campaigns`, { fields: "name,status,effective_status", limit: "200" }, credentials),
    ])
    const row = ins.data?.[0] ?? {}
    const spend = meta.num(row.spend)
    const purchases = meta.findAction(row.actions, meta.PURCHASE)
    const revenue = meta.findAction(row.action_values, meta.PURCHASE)
    const roas = spend ? revenue / spend : 0
    const campaigns: any[] = camps.data ?? []
    const active = campaigns.filter((c) => (c.effective_status || c.status) === "ACTIVE")
    return `- Meta Ads (últimos 7 dias): gasto R$ ${spend.toFixed(2)}, ${meta.num(row.impressions)} impressões, ${meta.num(row.clicks)} cliques, ${purchases} compras, ROAS ${roas.toFixed(2)}x. Campanhas: ${campaigns.length} no total, ${active.length} ativa(s).`
  } catch {
    return "- Meta Ads: conectado, mas não foi possível consultar agora."
  }
}

async function gaSummary(userId: string): Promise<string> {
  const credentials = await ga.getGoogleAnalyticsCredentials(userId)
  if (!ga.isConfigured(credentials)) return "- Tráfego (Google Analytics): não conectado."

  try {
    const [totals, channels] = await Promise.all([
      ga.runReport(
        {
          dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "conversions" }],
        },
        credentials,
      ),
      ga.runReport(
        {
          dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
          limit: 4,
        },
        credentials,
      ),
    ])
    const t = ga.firstRow(totals)
    const topChannels = ga
      .parseRows(channels)
      .map((r) => `${ga.translateChannel(r.sessionDefaultChannelGroup)} (${ga.num(r.sessions)})`)
      .join(", ")
    return `- Tráfego (Google Analytics, últimos 7 dias): ${ga.num(t.activeUsers)} usuários, ${ga.num(t.sessions)} sessões, ${ga.num(t.conversions)} conversões. Principais canais: ${topChannels || "sem dados"}.`
  } catch {
    return "- Tráfego (Google Analytics): conectado, mas não foi possível consultar agora."
  }
}

async function promoSummary(userId: string): Promise<string> {
  try {
    const rows = await db
      .select({ code: promotions.code, status: promotions.status })
      .from(promotions)
      .where(eq(promotions.userId, userId))
    if (rows.length === 0) return "- Promoções: nenhuma cadastrada."
    const active = rows.filter((r) => r.status === "ativo")
    const names = active.map((r) => r.code).slice(0, 5).join(", ")
    return `- Promoções: ${rows.length} cadastrada(s), ${active.length} ativa(s)${active.length ? ` (${names})` : ""}.`
  } catch {
    return "- Promoções: não foi possível consultar."
  }
}
