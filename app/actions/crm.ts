"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { leads, contacts, opportunities } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth"
import { createWebToLeadToken } from "@/lib/crm/web-to-lead-token"

export interface LeadDTO {
  id: string
  name: string
  email: string
  whatsapp: string
  source: "Meta" | "Google" | "Orgânico" | "Indicação" | "WhatsApp" | "Outro"
  status: "novo" | "contatado" | "qualificado" | "perdido"
  estimatedValue: number
  notes: string
  createdAt: string
}
export interface ContactDTO {
  id: string
  name: string
  email: string
  whatsapp: string
  document: string
  totalSpent: number
  lastOrderDate: string
  tags: string[]
  createdAt: string
}
export interface OpportunityDTO {
  id: string
  leadId: string
  leadName: string
  title: string
  value: number
  stage: "prospeccao" | "qualificacao" | "proposta" | "negociacao" | "fechado_ganho" | "fechado_perdido"
  probability: number
  closingDate: string
  createdAt: string
  notes: string
}
export interface CRMData { leads: LeadDTO[]; contacts: ContactDTO[]; opportunities: OpportunityDTO[] }
export type ImportLeadInput = {
  name?: string
  email?: string
  whatsapp?: string
  source?: LeadDTO["source"]
  status?: LeadDTO["status"]
  estimatedValue?: number
  notes?: string
}

const validSources: LeadDTO["source"][] = ["Meta", "Google", "Orgânico", "Indicação", "WhatsApp", "Outro"]
const validStatuses: LeadDTO["status"][] = ["novo", "contatado", "qualificado", "perdido"]

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function cleanMoney(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  const normalized = cleanText(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

async function load(userId: string): Promise<CRMData> {
  const [ls, cs, os] = await Promise.all([
    db.select().from(leads).where(eq(leads.userId, userId)),
    db.select().from(contacts).where(eq(contacts.userId, userId)),
    db.select().from(opportunities).where(eq(opportunities.userId, userId)),
  ])
  return {
    leads: ls.map((l) => ({
      id: String(l.id), name: l.name, email: l.email, whatsapp: l.whatsapp, source: l.source,
      status: l.status, estimatedValue: Number(l.estimatedValue), notes: l.notes, createdAt: l.createdAt,
    })).sort((a, b) => Number(a.id) - Number(b.id)),
    contacts: cs.map((c) => ({
      id: String(c.id), name: c.name, email: c.email, whatsapp: c.whatsapp, document: c.document,
      totalSpent: Number(c.totalSpent), lastOrderDate: c.lastOrderDate ?? "", tags: c.tags, createdAt: c.createdAt,
    })).sort((a, b) => Number(a.id) - Number(b.id)),
    opportunities: os.map((o) => ({
      id: String(o.id), leadId: o.leadId ? String(o.leadId) : "", leadName: o.leadName, title: o.title,
      value: Number(o.value), stage: o.stage, probability: o.probability, closingDate: o.closingDate ?? "",
      createdAt: o.createdAt, notes: o.notes,
    })).sort((a, b) => Number(a.id) - Number(b.id)),
  }
}

function today() { return new Date().toISOString().slice(0, 10) }

export async function listCRM(): Promise<CRMData> {
  const u = await requireUser()
  return load(u.id)
}

export async function getWebToLeadConfig() {
  const u = await requireUser()
  return { token: createWebToLeadToken(u.id) }
}

// ─── Leads ───────────────────────────────────────────────────────────────────
export async function createLead(data: Omit<LeadDTO, "id" | "createdAt">): Promise<CRMData> {
  const u = await requireUser()
  await db.insert(leads).values({
    userId: u.id, name: data.name, email: data.email, whatsapp: data.whatsapp, source: data.source,
    status: data.status, estimatedValue: String(data.estimatedValue), notes: data.notes, createdAt: today(),
  })
  return load(u.id)
}

export async function importLeadsAction(rows: ImportLeadInput[]): Promise<CRMData> {
  const u = await requireUser()
  const values = rows
    .slice(0, 500)
    .map((row) => {
      const name = cleanText(row.name)
      const email = cleanText(row.email)
      const whatsapp = cleanText(row.whatsapp)
      const notes = cleanText(row.notes)
      const hasSignal = Boolean(name || email || whatsapp || notes)
      return {
        userId: u.id,
        name: name || email || whatsapp || "Lead sem nome",
        email,
        whatsapp,
        source: validSources.includes(row.source as LeadDTO["source"]) ? row.source! : "Outro",
        status: validStatuses.includes(row.status as LeadDTO["status"]) ? row.status! : "novo",
        estimatedValue: String(cleanMoney(row.estimatedValue)),
        notes,
        createdAt: today(),
        hasSignal,
      }
    })
    .filter((row) => row.hasSignal)
    .map(({ hasSignal, ...row }) => row)

  if (values.length) await db.insert(leads).values(values)
  return load(u.id)
}
export async function updateLeadAction(id: string, data: Partial<LeadDTO>): Promise<CRMData> {
  const u = await requireUser()
  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.email !== undefined) patch.email = data.email
  if (data.whatsapp !== undefined) patch.whatsapp = data.whatsapp
  if (data.source !== undefined) patch.source = data.source
  if (data.status !== undefined) patch.status = data.status
  if (data.estimatedValue !== undefined) patch.estimatedValue = String(data.estimatedValue)
  if (data.notes !== undefined) patch.notes = data.notes
  if (Object.keys(patch).length) await db.update(leads).set(patch).where(and(eq(leads.id, Number(id)), eq(leads.userId, u.id)))
  return load(u.id)
}
export async function deleteLeadAction(id: string): Promise<CRMData> {
  const u = await requireUser()
  await db.delete(leads).where(and(eq(leads.id, Number(id)), eq(leads.userId, u.id)))
  return load(u.id)
}

// ─── Contacts ────────────────────────────────────────────────────────────────
export async function createContactAction(data: Omit<ContactDTO, "id" | "createdAt">): Promise<CRMData> {
  const u = await requireUser()
  await db.insert(contacts).values({
    userId: u.id, name: data.name, email: data.email, whatsapp: data.whatsapp, document: data.document,
    totalSpent: String(data.totalSpent), lastOrderDate: data.lastOrderDate || null, tags: data.tags, createdAt: today(),
  })
  return load(u.id)
}
export async function updateContactAction(id: string, data: Partial<ContactDTO>): Promise<CRMData> {
  const u = await requireUser()
  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.email !== undefined) patch.email = data.email
  if (data.whatsapp !== undefined) patch.whatsapp = data.whatsapp
  if (data.document !== undefined) patch.document = data.document
  if (data.totalSpent !== undefined) patch.totalSpent = String(data.totalSpent)
  if (data.lastOrderDate !== undefined) patch.lastOrderDate = data.lastOrderDate || null
  if (data.tags !== undefined) patch.tags = data.tags
  if (Object.keys(patch).length) await db.update(contacts).set(patch).where(and(eq(contacts.id, Number(id)), eq(contacts.userId, u.id)))
  return load(u.id)
}
export async function deleteContactAction(id: string): Promise<CRMData> {
  const u = await requireUser()
  await db.delete(contacts).where(and(eq(contacts.id, Number(id)), eq(contacts.userId, u.id)))
  return load(u.id)
}

// ─── Opportunities ───────────────────────────────────────────────────────────
async function validLeadId(userId: string, leadId: string): Promise<number | null> {
  if (!leadId) return null
  const n = Number(leadId)
  if (!Number.isInteger(n)) return null
  const row = await db.select({ id: leads.id }).from(leads).where(and(eq(leads.id, n), eq(leads.userId, userId))).limit(1)
  return row[0] ? n : null
}

export async function createOpportunity(data: Omit<OpportunityDTO, "id" | "createdAt">): Promise<CRMData> {
  const u = await requireUser()
  await db.insert(opportunities).values({
    userId: u.id, leadId: await validLeadId(u.id, data.leadId), leadName: data.leadName, title: data.title,
    value: String(data.value), stage: data.stage, probability: data.probability,
    closingDate: data.closingDate || null, notes: data.notes, createdAt: today(),
  })
  return load(u.id)
}
export async function updateOpportunityAction(id: string, data: Partial<OpportunityDTO>): Promise<CRMData> {
  const u = await requireUser()
  const patch: Record<string, unknown> = {}
  if (data.leadId !== undefined) patch.leadId = await validLeadId(u.id, data.leadId)
  if (data.leadName !== undefined) patch.leadName = data.leadName
  if (data.title !== undefined) patch.title = data.title
  if (data.value !== undefined) patch.value = String(data.value)
  if (data.stage !== undefined) patch.stage = data.stage
  if (data.probability !== undefined) patch.probability = data.probability
  if (data.closingDate !== undefined) patch.closingDate = data.closingDate || null
  if (data.notes !== undefined) patch.notes = data.notes
  if (Object.keys(patch).length) await db.update(opportunities).set(patch).where(and(eq(opportunities.id, Number(id)), eq(opportunities.userId, u.id)))
  return load(u.id)
}
export async function deleteOpportunityAction(id: string): Promise<CRMData> {
  const u = await requireUser()
  await db.delete(opportunities).where(and(eq(opportunities.id, Number(id)), eq(opportunities.userId, u.id)))
  return load(u.id)
}
