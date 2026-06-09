"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadSource = "Meta" | "Google" | "Orgânico" | "Indicação" | "WhatsApp" | "Outro"
export type LeadStatus = "novo" | "contatado" | "qualificado" | "perdido"
export type OpportunityStage =
  | "prospeccao"
  | "qualificacao"
  | "proposta"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido"

export interface Lead {
  id: string
  name: string
  email: string
  whatsapp: string
  source: LeadSource
  status: LeadStatus
  estimatedValue: number
  notes: string
  createdAt: string
}

export interface Contact {
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

export interface Opportunity {
  id: string
  leadId: string
  leadName: string
  title: string
  value: number
  stage: OpportunityStage
  probability: number
  closingDate: string
  createdAt: string
  notes: string
}

interface CRMState {
  leads: Lead[]
  contacts: Contact[]
  opportunities: Opportunity[]
}

interface CRMContextValue extends CRMState {
  // Leads
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void
  updateLead: (id: string, data: Partial<Lead>) => void
  deleteLead: (id: string) => void
  // Contacts
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void
  updateContact: (id: string, data: Partial<Contact>) => void
  deleteContact: (id: string) => void
  // Opportunities
  addOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => void
  moveOpportunity: (id: string, stage: OpportunityStage) => void
}

// ─── Mock seed data ───────────────────────────────────────────────────────────

const seedLeads: Lead[] = [
  { id: "l1", name: "Beatriz Nunes", email: "beatriz@email.com", whatsapp: "(11) 99999-1234", source: "Meta", status: "novo", estimatedValue: 350, notes: "Interessada em vestidos", createdAt: "2026-06-06" },
  { id: "l2", name: "Rafael Costa", email: "rafael@email.com", whatsapp: "(11) 98888-5678", source: "Google", status: "contatado", estimatedValue: 550, notes: "Quer conjunto verão", createdAt: "2026-06-05" },
  { id: "l3", name: "Juliana Alves", email: "juliana@email.com", whatsapp: "(11) 97777-9012", source: "Indicação", status: "qualificado", estimatedValue: 800, notes: "Cliente VIP indicada pela Mariana", createdAt: "2026-06-04" },
  { id: "l4", name: "Pedro Melo", email: "pedro@email.com", whatsapp: "(11) 96666-3456", source: "Orgânico", status: "perdido", estimatedValue: 200, notes: "Preço acima do esperado", createdAt: "2026-06-02" },
  { id: "l5", name: "Carla Lopes", email: "carla@email.com", whatsapp: "(11) 95555-7890", source: "WhatsApp", status: "novo", estimatedValue: 450, notes: "Viu anúncio no status", createdAt: "2026-06-07" },
]

const seedContacts: Contact[] = [
  { id: "c1", name: "Ana Lima", email: "ana.lima@email.com", whatsapp: "(11) 91234-5678", document: "123.456.789-00", totalSpent: 689.8, lastOrderDate: "2026-06-08", tags: ["vip", "fiel"], createdAt: "2026-01-10" },
  { id: "c2", name: "Mariana Santos", email: "mariana@email.com", whatsapp: "(11) 92345-6789", document: "234.567.890-11", totalSpent: 449.8, lastOrderDate: "2026-06-06", tags: ["recorrente"], createdAt: "2026-02-15" },
  { id: "c3", name: "Camila Rocha", email: "camila@email.com", whatsapp: "(11) 93456-7890", document: "345.678.901-22", totalSpent: 429.7, lastOrderDate: "2026-06-03", tags: ["vip"], createdAt: "2026-03-20" },
  { id: "c4", name: "Carlos Mendes", email: "carlos@email.com", whatsapp: "(11) 94567-8901", document: "456.789.012-33", totalSpent: 389.7, lastOrderDate: "2026-06-07", tags: ["novo"], createdAt: "2026-05-01" },
  { id: "c5", name: "Roberto Alves", email: "roberto@email.com", whatsapp: "(11) 95678-9012", document: "567.890.123-44", totalSpent: 259.8, lastOrderDate: "2026-06-05", tags: ["recorrente"], createdAt: "2026-04-12" },
]

const seedOpportunities: Opportunity[] = [
  { id: "o1", leadId: "l3", leadName: "Juliana Alves", title: "Compra Coleção Verão", value: 800, stage: "proposta", probability: 70, closingDate: "2026-06-15", createdAt: "2026-06-04", notes: "Enviou proposta por WhatsApp" },
  { id: "o2", leadId: "l2", leadName: "Rafael Costa", title: "Conjunto + Calça", value: 550, stage: "qualificacao", probability: 40, closingDate: "2026-06-20", createdAt: "2026-06-05", notes: "Aguardando retorno" },
  { id: "o3", leadId: "l5", leadName: "Carla Lopes", title: "Pedido Vestidos", value: 450, stage: "prospeccao", probability: 20, closingDate: "2026-06-25", createdAt: "2026-06-07", notes: "Primeiro contato feito" },
  { id: "o4", leadId: "l1", leadName: "Beatriz Nunes", title: "Compra Vestido Floral", value: 350, stage: "negociacao", probability: 85, closingDate: "2026-06-10", createdAt: "2026-06-06", notes: "Negociando frete grátis" },
  { id: "o5", leadId: "c1", leadName: "Ana Lima", title: "Renovação Coleção", value: 600, stage: "fechado_ganho", probability: 100, closingDate: "2026-06-08", createdAt: "2026-06-01", notes: "Pedido confirmado!" },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const CRMContext = createContext<CRMContextValue | null>(null)

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function now() {
  return new Date().toISOString().slice(0, 10)
}

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(seedLeads)
  const [contacts, setContacts] = useState<Contact[]>(seedContacts)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpportunities)

  useEffect(() => {
    const stored = localStorage.getItem("crm")
    if (stored) {
      const data: CRMState = JSON.parse(stored)
      setLeads(data.leads ?? seedLeads)
      setContacts(data.contacts ?? seedContacts)
      setOpportunities(data.opportunities ?? seedOpportunities)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("crm", JSON.stringify({ leads, contacts, opportunities }))
  }, [leads, contacts, opportunities])

  const addLead = (data: Omit<Lead, "id" | "createdAt">) =>
    setLeads((prev) => [...prev, { ...data, id: uid(), createdAt: now() }])

  const updateLead = (id: string, data: Partial<Lead>) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)))

  const deleteLead = (id: string) => setLeads((prev) => prev.filter((l) => l.id !== id))

  const addContact = (data: Omit<Contact, "id" | "createdAt">) =>
    setContacts((prev) => [...prev, { ...data, id: uid(), createdAt: now() }])

  const updateContact = (id: string, data: Partial<Contact>) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))

  const deleteContact = (id: string) => setContacts((prev) => prev.filter((c) => c.id !== id))

  const addOpportunity = (data: Omit<Opportunity, "id" | "createdAt">) =>
    setOpportunities((prev) => [...prev, { ...data, id: uid(), createdAt: now() }])

  const updateOpportunity = (id: string, data: Partial<Opportunity>) =>
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))

  const deleteOpportunity = (id: string) =>
    setOpportunities((prev) => prev.filter((o) => o.id !== id))

  const moveOpportunity = (id: string, stage: OpportunityStage) =>
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)))

  return (
    <CRMContext.Provider
      value={{
        leads, contacts, opportunities,
        addLead, updateLead, deleteLead,
        addContact, updateContact, deleteContact,
        addOpportunity, updateOpportunity, deleteOpportunity, moveOpportunity,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM() {
  const ctx = useContext(CRMContext)
  if (!ctx) throw new Error("useCRM must be used inside CRMProvider")
  return ctx
}
