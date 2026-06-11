import { config } from "dotenv"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { eq } from "drizzle-orm"

config({ path: ".env.local" })

import * as schema from "../lib/db/schema"

const sql = neon(process.env.DATABASE_URL_UNPOOLED!)
const db = drizzle(sql, { schema })

const EMAIL = "loja.lia.eluan@gmail.com"
const NAME = "Lia Eluan"

async function main() {
  const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, EMAIL)).limit(1)
  if (existing[0]) {
    console.log(`Usuário ${EMAIL} já existe (${existing[0].id}). Seed ignorado.`)
    return
  }

  const userId = randomUUID()
  const passwordHash = await bcrypt.hash(process.env.SEED_PASSWORD ?? "storeos123", 10)
  await db.insert(schema.users).values({ id: userId, email: EMAIL, name: NAME, passwordHash })
  console.log(`Usuário criado: ${EMAIL} / senha: ${process.env.SEED_PASSWORD ?? "storeos123"}`)

  // Settings + credentials (pré-preenche Shopify do env global)
  await db.insert(schema.settings).values({ userId, storeName: "Lia Eluan", storeEmail: EMAIL })
  await db.insert(schema.userCredentials).values({
    userId,
    shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN ?? null,
    shopifyToken: process.env.SHOPIFY_ACCESS_TOKEN ?? null,
  })

  // ─── Products + variants ──────────────────────────────────────────────
  const productSeed = [
    { oldId: 1, name: "Blusa Feminina", cost: 35, price: 89.9, margin: 30, stock: 0, createdAt: new Date(2023, 6, 15),
      variants: [{ old: "v1", size: "P", color: "Branco", stock: 5 }, { old: "v2", size: "M", color: "Branco", stock: 7 }, { old: "v3", size: "G", color: "Branco", stock: 3 }] },
    { oldId: 2, name: "Calça Jeans", cost: 45, price: 129.9, margin: 35, stock: 0, createdAt: new Date(2023, 6, 10),
      variants: [{ old: "v4", size: "38", color: "Azul", stock: 3 }, { old: "v5", size: "40", color: "Azul", stock: 4 }, { old: "v6", size: "42", color: "Azul", stock: 3 }] },
    { oldId: 3, name: "Vestido Casual", cost: 50, price: 149.9, margin: 40, stock: 8, createdAt: new Date(2023, 6, 5), variants: [] },
    { oldId: 4, name: "Saia Midi", cost: 30, price: 79.9, margin: 32, stock: 12, createdAt: new Date(2023, 5, 28), variants: [] },
    { oldId: 5, name: "Conjunto Verão", cost: 48, price: 139.9, margin: 38, stock: 0, createdAt: new Date(2023, 5, 20),
      variants: [{ old: "v7", size: "P", color: "Rosa", stock: 2 }, { old: "v8", size: "M", color: "Rosa", stock: 3 }] },
  ]

  const productIdMap = new Map<number, number>() // oldId → new serial
  const variantIdMap = new Map<string, number>() // "v1" → new serial

  for (const p of productSeed) {
    const [row] = await db.insert(schema.products).values({
      userId, name: p.name, cost: String(p.cost), price: String(p.price), margin: String(p.margin), stock: p.stock, createdAt: p.createdAt,
    }).returning({ id: schema.products.id })
    productIdMap.set(p.oldId, row.id)
    for (const v of p.variants) {
      const [vr] = await db.insert(schema.productVariants).values({
        productId: row.id, size: v.size, color: v.color, stock: v.stock,
      }).returning({ id: schema.productVariants.id })
      variantIdMap.set(v.old, vr.id)
    }
  }
  console.log(`Produtos: ${productIdMap.size}, variantes: ${variantIdMap.size}`)

  // ─── Suppliers ────────────────────────────────────────────────────────
  const supplierSeed = [
    { old: "s1", name: "Confecções Brasil Ltda", contact: "Marcos Oliveira", phone: "(11) 3333-1111", email: "comercial@confbrasil.com", category: "Vestuário", leadTimeDays: 7, minOrderValue: 500, totalPurchased: 18400, lastOrderDate: "2026-05-28", status: "ativo", notes: "Prazo de pagamento 30 dias. Entrega via transportadora própria." },
    { old: "s2", name: "Moda Sul Atacado", contact: "Fernanda Lima", phone: "(51) 99888-2222", email: "vendas@modasul.com.br", category: "Vestuário", leadTimeDays: 10, minOrderValue: 800, totalPurchased: 12600, lastOrderDate: "2026-06-01", status: "ativo", notes: "Coleção nova em julho. Enviar ordem até 15/06." },
    { old: "s3", name: "PackBox Embalagens", contact: "Ricardo Torres", phone: "(21) 2222-3333", email: "ric@packbox.com", category: "Embalagem", leadTimeDays: 5, minOrderValue: 200, totalPurchased: 3200, lastOrderDate: "2026-05-15", status: "ativo", notes: "Desconto de 8% a partir de 500 unidades." },
    { old: "s4", name: "Rápido Log Transportes", contact: "Ana Ferreira", phone: "(11) 4444-5555", email: "ana@rapidolog.com.br", category: "Logística", leadTimeDays: 2, minOrderValue: 0, totalPurchased: 5800, lastOrderDate: "2026-06-07", status: "ativo", notes: "Coleta diária às 18h. Frete com desconto para volumes acima de 30 caixas." },
    { old: "s5", name: "TechPrint Labels", contact: "Bruno Melo", phone: "(11) 5555-6666", email: "bruno@techprint.com", category: "Embalagem", leadTimeDays: 3, minOrderValue: 150, totalPurchased: 1400, lastOrderDate: "2026-04-20", status: "em_avaliacao", notes: "Novo fornecedor — aguardando aprovação do primeiro lote." },
    { old: "s6", name: "Atacado Fashion Rio", contact: "Clara Duarte", phone: "(21) 7777-8888", email: "clara@fashionrio.com", category: "Vestuário", leadTimeDays: 12, minOrderValue: 1000, totalPurchased: 0, lastOrderDate: null, status: "em_avaliacao", notes: "Cotação solicitada em 05/06." },
  ] as const

  const supplierIdMap = new Map<string, number>()
  for (const s of supplierSeed) {
    const [row] = await db.insert(schema.suppliers).values({
      userId, name: s.name, contact: s.contact, phone: s.phone, email: s.email,
      category: s.category, leadTimeDays: s.leadTimeDays, minOrderValue: String(s.minOrderValue),
      totalPurchased: String(s.totalPurchased), lastOrderDate: s.lastOrderDate, status: s.status, notes: s.notes,
    }).returning({ id: schema.suppliers.id })
    supplierIdMap.set(s.old, row.id)
  }
  console.log(`Fornecedores: ${supplierIdMap.size}`)

  // ─── Promotions ───────────────────────────────────────────────────────
  const promoSeed = [
    { code: "BEMVINDO10", description: "Desconto de boas-vindas para novos clientes", type: "percentual", value: 10, minOrderValue: 0, usageLimit: 100, usageCount: 34, validFrom: "2026-01-01", validTo: "2026-12-31", status: "ativo" },
    { code: "VERAO20", description: "Promoção coleção verão", type: "percentual", value: 20, minOrderValue: 150, usageLimit: 50, usageCount: 50, validFrom: "2026-01-01", validTo: "2026-03-31", status: "expirado" },
    { code: "FRETEGRATIS", description: "Frete grátis para pedidos acima de R$ 200", type: "frete_gratis", value: 0, minOrderValue: 200, usageLimit: null, usageCount: 89, validFrom: "2026-06-01", validTo: "2026-06-30", status: "ativo" },
    { code: "VIP50", description: "R$ 50 de desconto para clientes VIP", type: "fixo", value: 50, minOrderValue: 300, usageLimit: 20, usageCount: 8, validFrom: "2026-06-08", validTo: "2026-06-15", status: "ativo" },
    { code: "JULHO15", description: "15% off na coleção de julho", type: "percentual", value: 15, minOrderValue: 0, usageLimit: 200, usageCount: 0, validFrom: "2026-07-01", validTo: "2026-07-31", status: "agendado" },
    { code: "ANIVER30", description: "30% aniversário da loja", type: "percentual", value: 30, minOrderValue: 100, usageLimit: 30, usageCount: 30, validFrom: "2026-05-10", validTo: "2026-05-12", status: "expirado" },
  ] as const

  for (const p of promoSeed) {
    await db.insert(schema.promotions).values({
      userId, code: p.code, description: p.description, type: p.type, value: String(p.value),
      minOrderValue: String(p.minOrderValue), usageLimit: p.usageLimit, usageCount: p.usageCount,
      validFrom: p.validFrom, validTo: p.validTo, status: p.status,
    })
  }
  console.log(`Promoções: ${promoSeed.length}`)

  // ─── Leads + contacts + opportunities ─────────────────────────────────
  const leadSeed = [
    { old: "l1", name: "Beatriz Nunes", email: "beatriz@email.com", whatsapp: "(11) 99999-1234", source: "Meta", status: "novo", estimatedValue: 350, notes: "Interessada em vestidos", createdAt: "2026-06-06" },
    { old: "l2", name: "Rafael Costa", email: "rafael@email.com", whatsapp: "(11) 98888-5678", source: "Google", status: "contatado", estimatedValue: 550, notes: "Quer conjunto verão", createdAt: "2026-06-05" },
    { old: "l3", name: "Juliana Alves", email: "juliana@email.com", whatsapp: "(11) 97777-9012", source: "Indicação", status: "qualificado", estimatedValue: 800, notes: "Cliente VIP indicada pela Mariana", createdAt: "2026-06-04" },
    { old: "l4", name: "Pedro Melo", email: "pedro@email.com", whatsapp: "(11) 96666-3456", source: "Orgânico", status: "perdido", estimatedValue: 200, notes: "Preço acima do esperado", createdAt: "2026-06-02" },
    { old: "l5", name: "Carla Lopes", email: "carla@email.com", whatsapp: "(11) 95555-7890", source: "WhatsApp", status: "novo", estimatedValue: 450, notes: "Viu anúncio no status", createdAt: "2026-06-07" },
  ] as const

  const leadIdMap = new Map<string, number>()
  for (const l of leadSeed) {
    const [row] = await db.insert(schema.leads).values({
      userId, name: l.name, email: l.email, whatsapp: l.whatsapp, source: l.source,
      status: l.status, estimatedValue: String(l.estimatedValue), notes: l.notes, createdAt: l.createdAt,
    }).returning({ id: schema.leads.id })
    leadIdMap.set(l.old, row.id)
  }

  const contactSeed = [
    { name: "Ana Lima", email: "ana.lima@email.com", whatsapp: "(11) 91234-5678", document: "123.456.789-00", totalSpent: 689.8, lastOrderDate: "2026-06-08", tags: ["vip", "fiel"], createdAt: "2026-01-10" },
    { name: "Mariana Santos", email: "mariana@email.com", whatsapp: "(11) 92345-6789", document: "234.567.890-11", totalSpent: 449.8, lastOrderDate: "2026-06-06", tags: ["recorrente"], createdAt: "2026-02-15" },
    { name: "Camila Rocha", email: "camila@email.com", whatsapp: "(11) 93456-7890", document: "345.678.901-22", totalSpent: 429.7, lastOrderDate: "2026-06-03", tags: ["vip"], createdAt: "2026-03-20" },
    { name: "Carlos Mendes", email: "carlos@email.com", whatsapp: "(11) 94567-8901", document: "456.789.012-33", totalSpent: 389.7, lastOrderDate: "2026-06-07", tags: ["novo"], createdAt: "2026-05-01" },
    { name: "Roberto Alves", email: "roberto@email.com", whatsapp: "(11) 95678-9012", document: "567.890.123-44", totalSpent: 259.8, lastOrderDate: "2026-06-05", tags: ["recorrente"], createdAt: "2026-04-12" },
  ]
  for (const c of contactSeed) {
    await db.insert(schema.contacts).values({
      userId, name: c.name, email: c.email, whatsapp: c.whatsapp, document: c.document,
      totalSpent: String(c.totalSpent), lastOrderDate: c.lastOrderDate, tags: c.tags, createdAt: c.createdAt,
    })
  }

  // Opportunities — o5 referencia "c1" (um contato), não um lead → leadId null
  const oppSeed = [
    { leadOld: "l3", leadName: "Juliana Alves", title: "Compra Coleção Verão", value: 800, stage: "proposta", probability: 70, closingDate: "2026-06-15", createdAt: "2026-06-04", notes: "Enviou proposta por WhatsApp" },
    { leadOld: "l2", leadName: "Rafael Costa", title: "Conjunto + Calça", value: 550, stage: "qualificacao", probability: 40, closingDate: "2026-06-20", createdAt: "2026-06-05", notes: "Aguardando retorno" },
    { leadOld: "l5", leadName: "Carla Lopes", title: "Pedido Vestidos", value: 450, stage: "prospeccao", probability: 20, closingDate: "2026-06-25", createdAt: "2026-06-07", notes: "Primeiro contato feito" },
    { leadOld: "l1", leadName: "Beatriz Nunes", title: "Compra Vestido Floral", value: 350, stage: "negociacao", probability: 85, closingDate: "2026-06-10", createdAt: "2026-06-06", notes: "Negociando frete grátis" },
    { leadOld: "c1", leadName: "Ana Lima", title: "Renovação Coleção", value: 600, stage: "fechado_ganho", probability: 100, closingDate: "2026-06-08", createdAt: "2026-06-01", notes: "Pedido confirmado!" },
  ] as const
  for (const o of oppSeed) {
    await db.insert(schema.opportunities).values({
      userId, leadId: leadIdMap.get(o.leadOld) ?? null, leadName: o.leadName, title: o.title,
      value: String(o.value), stage: o.stage, probability: o.probability, closingDate: o.closingDate,
      createdAt: o.createdAt, notes: o.notes,
    })
  }
  console.log(`CRM: ${leadIdMap.size} leads, ${contactSeed.length} contatos, ${oppSeed.length} oportunidades`)

  // ─── Goals ────────────────────────────────────────────────────────────
  const goalSeed = [
    { metric: "receita", label: "Receita Mensal", target: 30000, current: 26500, unit: "currency", lowerIsBetter: false },
    { metric: "pedidos", label: "Pedidos no Mês", target: 50, current: 32, unit: "number", lowerIsBetter: false },
    { metric: "cpa", label: "CPA Máximo", target: 15, current: 12.5, unit: "currency", lowerIsBetter: true },
    { metric: "margem", label: "Margem Média", target: 75, current: 74.3, unit: "percent", lowerIsBetter: false },
    { metric: "novosClientes", label: "Novos Clientes", target: 40, current: 29, unit: "number", lowerIsBetter: false },
  ] as const
  for (const g of goalSeed) {
    await db.insert(schema.goals).values({
      userId, metric: g.metric, label: g.label, target: String(g.target), current: String(g.current), unit: g.unit, lowerIsBetter: g.lowerIsBetter,
    })
  }
  console.log(`Metas: ${goalSeed.length}`)

  // ─── Notifications ────────────────────────────────────────────────────
  const notifSeed = [
    { type: "estoque", severity: "critical", title: "Estoque crítico — Conjunto Verão", description: "Apenas 3 unidades restantes. Abaixo do limite mínimo de 5.", minutesAgo: 30, read: false, href: "/inventory" },
    { type: "estoque", severity: "critical", title: "Estoque crítico — Vestido Casual", description: "Apenas 2 unidades restantes. Risco de ruptura.", minutesAgo: 45, read: false, href: "/inventory" },
    { type: "pedido", severity: "warning", title: "Pedido #1042 pendente há 2h", description: "Ana Lima aguarda confirmação de pagamento.", minutesAgo: 120, read: false, href: "/orders" },
    { type: "meta", severity: "info", title: "Meta de receita: 88% atingida", description: "R$ 26.500 de R$ 30.000. Faltam R$ 3.500 para bater a meta do mês.", minutesAgo: 120, read: false, href: "/goals" },
    { type: "financeiro", severity: "warning", title: "Conta vencendo amanhã", description: "Google Ads — fatura Jun: R$ 2.100 vence em 09/06.", minutesAgo: 180, read: true, href: "/reports" },
    { type: "estoque", severity: "warning", title: "Estoque baixo — Blusa Feminina", description: "8 unidades. Considere repor em breve.", minutesAgo: 300, read: true, href: "/inventory" },
    { type: "marketing", severity: "info", title: "CPA abaixo da meta", description: "CPA atual R$ 12,50 — abaixo do limite de R$ 50. Tudo certo.", minutesAgo: 480, read: true, href: "/reports" },
  ] as const
  for (const n of notifSeed) {
    await db.insert(schema.notifications).values({
      userId, type: n.type, severity: n.severity, title: n.title, description: n.description,
      read: n.read, href: n.href, createdAt: new Date(Date.now() - n.minutesAgo * 60 * 1000),
    })
  }
  console.log(`Notificações: ${notifSeed.length}`)

  // ─── Stock entries + items ────────────────────────────────────────────
  const entrySeed = [
    { date: "2026-05-28", supplierOld: "s1", supplierName: "Confecções Brasil Ltda", nf: "NF-2026-1042", totalCost: 1100,
      items: [{ pOld: 1, name: "Blusa Feminina", vOld: "v1", vLabel: "P / Branco", qty: 10, cost: 35 }, { pOld: 1, name: "Blusa Feminina", vOld: "v2", vLabel: "M / Branco", qty: 10, cost: 35 }, { pOld: 3, name: "Vestido Casual", vOld: null, vLabel: null, qty: 8, cost: 50 }] },
    { date: "2026-06-01", supplierOld: "s2", supplierName: "Moda Sul Atacado", nf: "NF-2026-0081", totalCost: 810,
      items: [{ pOld: 2, name: "Calça Jeans", vOld: "v4", vLabel: "38 / Azul", qty: 5, cost: 45 }, { pOld: 2, name: "Calça Jeans", vOld: "v5", vLabel: "40 / Azul", qty: 5, cost: 45 }, { pOld: 4, name: "Saia Midi", vOld: null, vLabel: null, qty: 12, cost: 30 }] },
    { date: "2026-06-05", supplierOld: "s1", supplierName: "Confecções Brasil Ltda", nf: "NF-2026-1089", totalCost: 576,
      items: [{ pOld: 5, name: "Conjunto Verão", vOld: "v7", vLabel: "P / Rosa", qty: 6, cost: 48 }, { pOld: 5, name: "Conjunto Verão", vOld: "v8", vLabel: "M / Rosa", qty: 6, cost: 48 }] },
  ] as const
  for (const e of entrySeed) {
    const [er] = await db.insert(schema.stockEntries).values({
      userId, date: e.date, supplierId: supplierIdMap.get(e.supplierOld) ?? null, supplierName: e.supplierName, nf: e.nf, totalCost: String(e.totalCost),
    }).returning({ id: schema.stockEntries.id })
    for (const it of e.items) {
      await db.insert(schema.stockEntryItems).values({
        entryId: er.id, productId: productIdMap.get(it.pOld) ?? null, productName: it.name,
        variantId: it.vOld ? (variantIdMap.get(it.vOld) ?? null) : null, variantLabel: it.vLabel,
        quantity: it.qty, unitCost: String(it.cost),
      })
    }
  }
  console.log(`Entradas de estoque: ${entrySeed.length}`)

  // ─── Returns + trocas ─────────────────────────────────────────────────
  const returnSeed = [
    { orderRef: "#1035", customer: "Lucas Ferreira", product: "Saia Midi", date: "2026-06-05", motivo: "arrependimento", frete: "cliente", valor: 79.9, status: "reembolsada" },
    { orderRef: "#1033", customer: "Diego Lima", product: "Calça Jeans", date: "2026-06-03", motivo: "tamanho", frete: "loja", valor: 129.9, status: "aprovada" },
    { orderRef: "#1038", customer: "Mariana Santos", product: "Vestido Casual", date: "2026-06-07", motivo: "defeito", frete: "loja", valor: 149.9, status: "aguardando" },
    { orderRef: "#1039", customer: "João Pereira", product: "Saia Midi", date: "2026-06-06", motivo: "outro", frete: "cliente", valor: 79.9, status: "recusada" },
  ] as const
  for (const r of returnSeed) {
    await db.insert(schema.returns).values({
      userId, orderRef: r.orderRef, customer: r.customer, product: r.product, date: r.date,
      motivo: r.motivo, freteResponsavel: r.frete, valor: String(r.valor), status: r.status,
    })
  }

  const trocaSeed = [
    { orderRef: "#1041", customer: "Carlos Mendes", productReturned: "Vestido Casual", sizeReturned: "P", productSent: "Vestido Casual", sizeSent: "M", date: "2026-06-08", motivo: "Tamanho pequeno", status: "aguardando_devolucao" },
    { orderRef: "#1034", customer: "Camila Rocha", productReturned: "Conjunto Verão", sizeReturned: "G", productSent: "Conjunto Verão", sizeSent: "M", date: "2026-06-06", motivo: "Tamanho grande", status: "item_recebido" },
    { orderRef: "#1036", customer: "Patrícia Souza", productReturned: "Blusa Feminina", sizeReturned: "M", productSent: "Blusa Feminina", sizeSent: "G", date: "2026-06-05", motivo: "Tamanho errado", status: "novo_enviado" },
    { orderRef: "#1039", customer: "João Pereira", productReturned: "Saia Midi", sizeReturned: "P", productSent: "Calça Jeans", sizeSent: "38", date: "2026-06-03", motivo: "Preferência por outro produto", status: "concluida" },
  ] as const
  for (const t of trocaSeed) {
    await db.insert(schema.trocas).values({
      userId, orderRef: t.orderRef, customer: t.customer, productReturned: t.productReturned, sizeReturned: t.sizeReturned,
      productSent: t.productSent, sizeSent: t.sizeSent, date: t.date, motivo: t.motivo, status: t.status,
    })
  }
  console.log(`Devoluções: ${returnSeed.length}, trocas: ${trocaSeed.length}`)

  console.log("\n✓ Seed concluído com sucesso!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
