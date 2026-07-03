import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { verifyWebToLeadToken } from "@/lib/crm/web-to-lead-token"

type LeadSource = "Meta" | "Google" | "Orgânico" | "Indicação" | "WhatsApp" | "Outro"

const validSources = new Set<LeadSource>(["Meta", "Google", "Orgânico", "Indicação", "WhatsApp", "Outro"])

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function source(value: unknown): LeadSource {
  const normalized = text(value)
  return validSources.has(normalized as LeadSource) ? normalized as LeadSource : "Outro"
}

function money(value: unknown) {
  const raw = typeof value === "number" ? String(value) : text(value)
  const normalized = raw.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

async function readBody(request: NextRequest) {
  const type = request.headers.get("content-type") || ""
  if (type.includes("application/json")) return request.json().catch(() => ({}))
  if (type.includes("form")) {
    const form = await request.formData()
    return Object.fromEntries(form.entries())
  }
  return {}
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url)
  const payload = await readBody(request)
  const userId = verifyWebToLeadToken(url.searchParams.get("token") || text(payload.token))

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Token inválido." }, { status: 401, headers: { "Access-Control-Allow-Origin": "*" } })
  }

  if (text(payload.company_website)) {
    return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } })
  }

  const name = text(payload.name || payload.nome)
  const email = text(payload.email)
  const whatsapp = text(payload.whatsapp || payload.phone || payload.telefone)
  if (!name && !email && !whatsapp) {
    return NextResponse.json(
      { ok: false, error: "Informe nome, email ou WhatsApp." },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  }

  const campaign = text(payload.campaign || payload.campanha)
  const page = text(payload.page || payload.pagina || payload.url)
  const message = text(payload.notes || payload.observacoes || payload.message || payload.mensagem)
  const notes = [
    message,
    campaign ? `Campanha: ${campaign}` : "",
    page ? `Página: ${page}` : "",
    "Origem: Web-to-Lead",
  ].filter(Boolean).join("\n")

  await db.insert(leads).values({
    userId,
    name: name || email || whatsapp || "Lead sem nome",
    email,
    whatsapp,
    source: source(payload.source || payload.origem),
    status: "novo",
    estimatedValue: String(money(payload.estimatedValue || payload.valor || payload.value)),
    notes,
    createdAt: new Date().toISOString().slice(0, 10),
  })

  return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } })
}
