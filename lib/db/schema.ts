import {
  pgTable,
  pgEnum,
  serial,
  bigserial,
  text,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Enums ──────────────────────────────────────────────────────────────────
export const supplierStatus = pgEnum("supplier_status", ["ativo", "inativo", "em_avaliacao"])
export const supplierCategory = pgEnum("supplier_category", ["Vestuário", "Embalagem", "Logística", "Tecnologia", "Outros"])
export const discountType = pgEnum("discount_type", ["percentual", "fixo", "frete_gratis"])
export const promotionStatus = pgEnum("promotion_status", ["ativo", "agendado", "expirado", "inativo"])
export const goalUnit = pgEnum("goal_unit", ["currency", "number", "percent"])
export const goalMetric = pgEnum("goal_metric", ["receita", "pedidos", "cpa", "margem", "novosClientes"])
export const notificationType = pgEnum("notification_type", ["estoque", "financeiro", "pedido", "meta", "marketing"])
export const notificationSeverity = pgEnum("notification_severity", ["critical", "warning", "info"])
export const leadSource = pgEnum("lead_source", ["Meta", "Google", "Orgânico", "Indicação", "WhatsApp", "Outro"])
export const leadStatus = pgEnum("lead_status", ["novo", "contatado", "qualificado", "perdido"])
export const opportunityStage = pgEnum("opportunity_stage", ["prospeccao", "qualificacao", "proposta", "negociacao", "fechado_ganho", "fechado_perdido"])
export const chatRole = pgEnum("chat_role", ["user", "assistant"])
export const returnMotivo = pgEnum("return_motivo", ["defeito", "arrependimento", "tamanho", "outro"])
export const returnStatus = pgEnum("return_status", ["aguardando", "aprovada", "reembolsada", "recusada"])
export const trocaStatus = pgEnum("troca_status", ["aguardando_devolucao", "item_recebido", "novo_enviado", "concluida", "cancelada"])

// ─── Auth ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // opaque random token
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  userIdx: index("sessions_user_idx").on(t.userId),
}))

// Secrets — plaintext for now (future: encrypt at rest)
export const userCredentials = pgTable("user_credentials", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  shopifyDomain: text("shopify_domain"),
  shopifyToken: text("shopify_token"),
  whatsappPhone: text("whatsapp_phone"),
  whatsappApiKey: text("whatsapp_api_key"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// ─── Settings (per-user, no credential fields) ──────────────────────────────
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  shippingCost: numeric("shipping_cost").notNull().default("30"),
  marketingBudget: numeric("marketing_budget").notNull().default("300"),
  packagingCost: numeric("packaging_cost").notNull().default("0.6"),
  paymentFeePercentage: numeric("payment_fee_percentage").notNull().default("5"),
  expectedMonthlySales: integer("expected_monthly_sales").notNull().default(50),
  storeName: text("store_name").notNull().default(""),
  storeCNPJ: text("store_cnpj").notNull().default(""),
  storeEmail: text("store_email").notNull().default(""),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  maxCACAlert: numeric("max_cac_alert").notNull().default("50"),
})

// ─── Products ───────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  cost: numeric("cost").notNull(),
  price: numeric("price").notNull(),
  margin: numeric("margin").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  size: text("size").notNull().default(""),
  color: text("color").notNull().default(""),
  stock: integer("stock").notNull().default(0),
})

// ─── Suppliers ──────────────────────────────────────────────────────────────
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contact: text("contact").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  category: supplierCategory("category").notNull().default("Outros"),
  leadTimeDays: integer("lead_time_days").notNull().default(0),
  minOrderValue: numeric("min_order_value").notNull().default("0"),
  totalPurchased: numeric("total_purchased").notNull().default("0"),
  lastOrderDate: date("last_order_date"),
  status: supplierStatus("status").notNull().default("ativo"),
  notes: text("notes").notNull().default(""),
})

// ─── Promotions ─────────────────────────────────────────────────────────────
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  description: text("description").notNull().default(""),
  type: discountType("type").notNull(),
  value: numeric("value").notNull().default("0"),
  minOrderValue: numeric("min_order_value").notNull().default("0"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  status: promotionStatus("status").notNull().default("ativo"),
})

// ─── CRM ────────────────────────────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  source: leadSource("source").notNull().default("Outro"),
  status: leadStatus("status").notNull().default("novo"),
  estimatedValue: numeric("estimated_value").notNull().default("0"),
  notes: text("notes").notNull().default(""),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  document: text("document").notNull().default(""),
  totalSpent: numeric("total_spent").notNull().default("0"),
  lastOrderDate: date("last_order_date"),
  tags: text("tags").array().notNull().default([]),
  createdAt: date("created_at").notNull().defaultNow(),
})

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  leadName: text("lead_name").notNull().default(""),
  title: text("title").notNull(),
  value: numeric("value").notNull().default("0"),
  stage: opportunityStage("stage").notNull().default("prospeccao"),
  probability: integer("probability").notNull().default(0),
  closingDate: date("closing_date"),
  notes: text("notes").notNull().default(""),
  createdAt: date("created_at").notNull().defaultNow(),
})

// ─── Goals ──────────────────────────────────────────────────────────────────
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  metric: goalMetric("metric").notNull(),
  label: text("label").notNull(),
  target: numeric("target").notNull(),
  current: numeric("current").notNull(),
  unit: goalUnit("unit").notNull(),
  lowerIsBetter: boolean("lower_is_better").notNull().default(false),
})

// ─── Notifications ──────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: notificationType("type").notNull(),
  severity: notificationSeverity("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  read: boolean("read").notNull().default(false),
  href: text("href"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// ─── Stock entries ──────────────────────────────────────────────────────────
export const stockEntries = pgTable("stock_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
  supplierName: text("supplier_name").notNull().default(""),
  nf: text("nf"),
  totalCost: numeric("total_cost").notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const stockEntryItems = pgTable("stock_entry_items", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").notNull().references(() => stockEntries.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull().default(""),
  variantId: integer("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  variantLabel: text("variant_label"),
  quantity: integer("quantity").notNull().default(0),
  unitCost: numeric("unit_cost").notNull().default("0"),
})

// ─── Returns / Trocas ───────────────────────────────────────────────────────
export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderRef: text("order_ref").notNull().default(""),
  customer: text("customer").notNull().default(""),
  product: text("product").notNull().default(""),
  date: date("date").notNull(),
  motivo: returnMotivo("motivo").notNull(),
  freteResponsavel: text("frete_responsavel").notNull().default("loja"),
  valor: numeric("valor").notNull().default("0"),
  status: returnStatus("status").notNull().default("aguardando"),
})

export const trocas = pgTable("trocas", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderRef: text("order_ref").notNull().default(""),
  customer: text("customer").notNull().default(""),
  productReturned: text("product_returned").notNull().default(""),
  sizeReturned: text("size_returned").notNull().default(""),
  productSent: text("product_sent").notNull().default(""),
  sizeSent: text("size_sent").notNull().default(""),
  date: date("date").notNull(),
  motivo: text("motivo").notNull().default(""),
  status: trocaStatus("status").notNull().default("aguardando_devolucao"),
})

// ─── Chat (IA) ──────────────────────────────────────────────────────────────
export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(), // sess_...
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const chatMessages = pgTable("chat_messages", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  sessionId: text("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: chatRole("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  sessionIdx: index("chat_messages_session_idx").on(t.sessionId, t.createdAt),
}))

// ─── Saved scenarios (simulator, optional) ──────────────────────────────────
export const savedScenarios = pgTable("saved_scenarios", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// ─── Relations ──────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many, one }) => ({
  products: many(products),
  suppliers: many(suppliers),
  promotions: many(promotions),
  leads: many(leads),
  contacts: many(contacts),
  opportunities: many(opportunities),
  goals: many(goals),
  notifications: many(notifications),
  stockEntries: many(stockEntries),
  returns: many(returns),
  trocas: many(trocas),
  credentials: one(userCredentials),
  settings: one(settings),
}))

export const productsRelations = relations(products, ({ many, one }) => ({
  variants: many(productVariants),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}))

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}))

export const stockEntriesRelations = relations(stockEntries, ({ many, one }) => ({
  items: many(stockEntryItems),
  supplier: one(suppliers, { fields: [stockEntries.supplierId], references: [suppliers.id] }),
}))

export const stockEntryItemsRelations = relations(stockEntryItems, ({ one }) => ({
  entry: one(stockEntries, { fields: [stockEntryItems.entryId], references: [stockEntries.id] }),
}))

export const leadsRelations = relations(leads, ({ many }) => ({
  opportunities: many(opportunities),
}))

export const opportunitiesRelations = relations(opportunities, ({ one }) => ({
  lead: one(leads, { fields: [opportunities.leadId], references: [leads.id] }),
}))

// ─── Inferred types ─────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect
export type Session = typeof sessions.$inferSelect
export type DBProduct = typeof products.$inferSelect
export type DBProductVariant = typeof productVariants.$inferSelect
export type DBSupplier = typeof suppliers.$inferSelect
export type DBPromotion = typeof promotions.$inferSelect
export type DBLead = typeof leads.$inferSelect
export type DBContact = typeof contacts.$inferSelect
export type DBOpportunity = typeof opportunities.$inferSelect
export type DBGoal = typeof goals.$inferSelect
export type DBNotification = typeof notifications.$inferSelect
export type DBStockEntry = typeof stockEntries.$inferSelect
export type DBSettings = typeof settings.$inferSelect
export type DBCredentials = typeof userCredentials.$inferSelect
