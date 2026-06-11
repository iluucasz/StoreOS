import { NextResponse } from "next/server"
import { isConfigured, graph, accountId, timeRange, findAction, num, PURCHASE, MetaError } from "@/lib/meta-ads"

const GENDER_PT: Record<string, string> = { male: "Masculino", female: "Feminino", unknown: "Não informado" }

/** Demografia (idade × gênero) dos últimos 30 dias. */
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ configured: false })

  try {
    const data = await graph(`${accountId()}/insights`, {
      fields: "spend,impressions,clicks,actions",
      breakdowns: "age,gender",
      time_range: timeRange(30, 0),
      limit: "300",
    })

    const rows = (data.data ?? []).map((r: any) => ({
      age: r.age,
      gender: GENDER_PT[r.gender] || r.gender,
      spend: Math.round(num(r.spend) * 100) / 100,
      impressions: num(r.impressions),
      clicks: num(r.clicks),
      purchases: findAction(r.actions, PURCHASE),
    }))

    const agg = (key: "age" | "gender") => {
      const map = new Map<string, number>()
      for (const r of rows) map.set(r[key], (map.get(r[key]) ?? 0) + r.spend)
      return [...map.entries()].map(([name, spend]) => ({ name, spend: Math.round(spend * 100) / 100 }))
    }

    return NextResponse.json({
      configured: true,
      byAge: agg("age").sort((a, b) => a.name.localeCompare(b.name)),
      byGender: agg("gender"),
      rows: rows.sort((a: any, b: any) => b.spend - a.spend),
    })
  } catch (e) {
    const message = e instanceof MetaError ? e.message : "Erro ao buscar demografia da Meta"
    return NextResponse.json({ configured: true, error: message }, { status: 502 })
  }
}
