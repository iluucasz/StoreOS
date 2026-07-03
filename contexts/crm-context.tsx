"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  listCRM,
  importLeadsAction,
  createLead, updateLeadAction, deleteLeadAction,
  createContactAction, updateContactAction, deleteContactAction,
  createOpportunity, updateOpportunityAction, deleteOpportunityAction,
  type ImportLeadInput,
} from "@/app/actions/crm"

export type LeadSource = "Meta" | "Google" | "Orgânico" | "Indicação" | "WhatsApp" | "Outro"
export type LeadStatus = "novo" | "contatado" | "qualificado" | "perdido"
export type OpportunityStage =
  | "prospeccao" | "qualificacao" | "proposta" | "negociacao" | "fechado_ganho" | "fechado_perdido"

export interface Lead {
  id: string; name: string; email: string; whatsapp: string
  source: LeadSource; status: LeadStatus; estimatedValue: number; notes: string; createdAt: string
}
export interface Contact {
  id: string; name: string; email: string; whatsapp: string; document: string
  totalSpent: number; lastOrderDate: string; tags: string[]; createdAt: string
}
export interface Opportunity {
  id: string; leadId: string; leadName: string; title: string; value: number
  stage: OpportunityStage; probability: number; closingDate: string; createdAt: string; notes: string
}

interface CRMContextValue {
  leads: Lead[]
  contacts: Contact[]
  opportunities: Opportunity[]
  loading: boolean
  importLeads: (rows: ImportLeadInput[]) => Promise<void>
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void
  updateLead: (id: string, data: Partial<Lead>) => void
  deleteLead: (id: string) => void
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void
  updateContact: (id: string, data: Partial<Contact>) => void
  deleteContact: (id: string) => void
  addOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => void
  moveOpportunity: (id: string, stage: OpportunityStage) => void
}

const CRMContext = createContext<CRMContextValue | null>(null)

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  function apply(data: { leads: Lead[]; contacts: Contact[]; opportunities: Opportunity[] }) {
    setLeads(data.leads)
    setContacts(data.contacts)
    setOpportunities(data.opportunities)
  }

  useEffect(() => {
    listCRM()
      .then(apply)
      .catch((error) => {
        console.error("Failed to load CRM:", error)
        apply({ leads: [], contacts: [], opportunities: [] })
      })
      .finally(() => setLoading(false))
  }, [])

  const addLead = (data: Omit<Lead, "id" | "createdAt">) => {
    createLead(data).then(apply).catch((error) => console.error("Failed to create lead:", error))
  }
  const importLeads = async (rows: ImportLeadInput[]) => {
    const next = await importLeadsAction(rows)
    apply(next)
  }
  const updateLead = (id: string, data: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)))
    updateLeadAction(id, data).then(apply).catch((error) => console.error("Failed to update lead:", error))
  }
  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    deleteLeadAction(id).then(apply).catch((error) => console.error("Failed to delete lead:", error))
  }

  const addContact = (data: Omit<Contact, "id" | "createdAt">) => {
    createContactAction(data).then(apply).catch((error) => console.error("Failed to create contact:", error))
  }
  const updateContact = (id: string, data: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
    updateContactAction(id, data).then(apply).catch((error) => console.error("Failed to update contact:", error))
  }
  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    deleteContactAction(id).then(apply).catch((error) => console.error("Failed to delete contact:", error))
  }

  const addOpportunity = (data: Omit<Opportunity, "id" | "createdAt">) => {
    createOpportunity(data).then(apply).catch((error) => console.error("Failed to create opportunity:", error))
  }
  const updateOpportunity = (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
    updateOpportunityAction(id, data).then(apply).catch((error) => console.error("Failed to update opportunity:", error))
  }
  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    deleteOpportunityAction(id).then(apply).catch((error) => console.error("Failed to delete opportunity:", error))
  }
  const moveOpportunity = (id: string, stage: OpportunityStage) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)))
    updateOpportunityAction(id, { stage }).then(apply).catch((error) => console.error("Failed to move opportunity:", error))
  }

  return (
    <CRMContext.Provider
      value={{
        leads, contacts, opportunities, loading,
        importLeads,
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
