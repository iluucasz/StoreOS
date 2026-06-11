CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('percentual', 'fixo', 'frete_gratis');--> statement-breakpoint
CREATE TYPE "public"."goal_metric" AS ENUM('receita', 'pedidos', 'cpa', 'margem', 'novosClientes');--> statement-breakpoint
CREATE TYPE "public"."goal_unit" AS ENUM('currency', 'number', 'percent');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('Meta', 'Google', 'Orgânico', 'Indicação', 'WhatsApp', 'Outro');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('novo', 'contatado', 'qualificado', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."notification_severity" AS ENUM('critical', 'warning', 'info');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('estoque', 'financeiro', 'pedido', 'meta', 'marketing');--> statement-breakpoint
CREATE TYPE "public"."opportunity_stage" AS ENUM('prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechado_ganho', 'fechado_perdido');--> statement-breakpoint
CREATE TYPE "public"."promotion_status" AS ENUM('ativo', 'agendado', 'expirado', 'inativo');--> statement-breakpoint
CREATE TYPE "public"."return_motivo" AS ENUM('defeito', 'arrependimento', 'tamanho', 'outro');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('aguardando', 'aprovada', 'reembolsada', 'recusada');--> statement-breakpoint
CREATE TYPE "public"."supplier_category" AS ENUM('Vestuário', 'Embalagem', 'Logística', 'Tecnologia', 'Outros');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('ativo', 'inativo', 'em_avaliacao');--> statement-breakpoint
CREATE TYPE "public"."troca_status" AS ENUM('aguardando_devolucao', 'item_recebido', 'novo_enviado', 'concluida', 'cancelada');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"document" text DEFAULT '' NOT NULL,
	"total_spent" numeric DEFAULT '0' NOT NULL,
	"last_order_date" date,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"metric" "goal_metric" NOT NULL,
	"label" text NOT NULL,
	"target" numeric NOT NULL,
	"current" numeric NOT NULL,
	"unit" "goal_unit" NOT NULL,
	"lower_is_better" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"source" "lead_source" DEFAULT 'Outro' NOT NULL,
	"status" "lead_status" DEFAULT 'novo' NOT NULL,
	"estimated_value" numeric DEFAULT '0' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"severity" "notification_severity" NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"href" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lead_id" integer,
	"lead_name" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"value" numeric DEFAULT '0' NOT NULL,
	"stage" "opportunity_stage" DEFAULT 'prospeccao' NOT NULL,
	"probability" integer DEFAULT 0 NOT NULL,
	"closing_date" date,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size" text DEFAULT '' NOT NULL,
	"color" text DEFAULT '' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"cost" numeric NOT NULL,
	"price" numeric NOT NULL,
	"margin" numeric NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"type" "discount_type" NOT NULL,
	"value" numeric DEFAULT '0' NOT NULL,
	"min_order_value" numeric DEFAULT '0' NOT NULL,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date NOT NULL,
	"status" "promotion_status" DEFAULT 'ativo' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_ref" text DEFAULT '' NOT NULL,
	"customer" text DEFAULT '' NOT NULL,
	"product" text DEFAULT '' NOT NULL,
	"date" date NOT NULL,
	"motivo" "return_motivo" NOT NULL,
	"frete_responsavel" text DEFAULT 'loja' NOT NULL,
	"valor" numeric DEFAULT '0' NOT NULL,
	"status" "return_status" DEFAULT 'aguardando' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shipping_cost" numeric DEFAULT '30' NOT NULL,
	"marketing_budget" numeric DEFAULT '300' NOT NULL,
	"packaging_cost" numeric DEFAULT '0.6' NOT NULL,
	"payment_fee_percentage" numeric DEFAULT '5' NOT NULL,
	"expected_monthly_sales" integer DEFAULT 50 NOT NULL,
	"store_name" text DEFAULT '' NOT NULL,
	"store_cnpj" text DEFAULT '' NOT NULL,
	"store_email" text DEFAULT '' NOT NULL,
	"low_stock_threshold" integer DEFAULT 5 NOT NULL,
	"max_cac_alert" numeric DEFAULT '50' NOT NULL,
	CONSTRAINT "settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "stock_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"supplier_id" integer,
	"supplier_name" text DEFAULT '' NOT NULL,
	"nf" text,
	"total_cost" numeric DEFAULT '0' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_entry_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer NOT NULL,
	"product_id" integer,
	"product_name" text DEFAULT '' NOT NULL,
	"variant_id" integer,
	"variant_label" text,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit_cost" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"category" "supplier_category" DEFAULT 'Outros' NOT NULL,
	"lead_time_days" integer DEFAULT 0 NOT NULL,
	"min_order_value" numeric DEFAULT '0' NOT NULL,
	"total_purchased" numeric DEFAULT '0' NOT NULL,
	"last_order_date" date,
	"status" "supplier_status" DEFAULT 'ativo' NOT NULL,
	"notes" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trocas" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_ref" text DEFAULT '' NOT NULL,
	"customer" text DEFAULT '' NOT NULL,
	"product_returned" text DEFAULT '' NOT NULL,
	"size_returned" text DEFAULT '' NOT NULL,
	"product_sent" text DEFAULT '' NOT NULL,
	"size_sent" text DEFAULT '' NOT NULL,
	"date" date NOT NULL,
	"motivo" text DEFAULT '' NOT NULL,
	"status" "troca_status" DEFAULT 'aguardando_devolucao' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shopify_domain" text,
	"shopify_token" text,
	"whatsapp_phone" text,
	"whatsapp_api_key" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_credentials_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_scenarios" ADD CONSTRAINT "saved_scenarios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_entries" ADD CONSTRAINT "stock_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_entries" ADD CONSTRAINT "stock_entries_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_entry_items" ADD CONSTRAINT "stock_entry_items_entry_id_stock_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."stock_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_entry_items" ADD CONSTRAINT "stock_entry_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_entry_items" ADD CONSTRAINT "stock_entry_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trocas" ADD CONSTRAINT "trocas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_messages_session_idx" ON "chat_messages" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");