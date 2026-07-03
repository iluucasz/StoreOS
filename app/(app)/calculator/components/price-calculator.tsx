"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/utils"

function calcPrice(fixedCost: number, pctFees: number, margin: number): number {
  const denom = 1 - pctFees / 100 - margin / 100
  return denom > 0 ? fixedCost / denom : fixedCost * 10
}

// ─── Shared numeric input (string-buffer pattern) ────────────────────────────
// Keeps an internal string while the user is typing so backspace and
// select-all work naturally. Normalises on blur.

type NumericInputProps = {
  id?: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  max?: number
  className?: string
}

function NumericInput({ id, value, onChange, prefix, suffix, max = 99999, className }: NumericInputProps) {
  const [str, setStr] = useState(String(value))
  const externalRef = useRef(value)

  // Sync only when the external value changes from outside (e.g. a reset)
  useEffect(() => {
    if (value !== externalRef.current) {
      externalRef.current = value
      setStr(String(value))
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // Allow empty, minus (for future), digits and one decimal separator
    if (raw === "" || /^[\d]*[.,]?[\d]*$/.test(raw)) {
      setStr(raw)
      const parsed = parseFloat(raw.replace(",", "."))
      if (!isNaN(parsed) && parsed >= 0 && parsed <= max) {
        externalRef.current = parsed
        onChange(parsed)
      }
    }
  }

  function handleBlur() {
    const parsed = parseFloat(str.replace(",", "."))
    const clamped = isNaN(parsed) || parsed < 0 ? 0 : Math.min(parsed, max)
    externalRef.current = clamped
    setStr(String(clamped))
    onChange(clamped)
  }

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        inputMode="decimal"
        value={str}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        className={[prefix ? "pl-9" : "", suffix ? "pr-12" : "", className ?? ""].join(" ").trim()}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
          {suffix}
        </span>
      )}
    </div>
  )
}

// ─── Labelled field wrapper ───────────────────────────────────────────────────

type FieldProps = {
  id: string
  label: string
  hint: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  max?: number
}

function Field({ id, label, hint, value, onChange, prefix, suffix, max }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs"><p>{hint}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <NumericInput id={id} value={value} onChange={onChange} prefix={prefix} suffix={suffix} max={max} />
    </div>
  )
}

function PriceTier({
  label,
  sublabel,
  price,
  highlighted,
}: {
  label: string
  sublabel: string
  price: number
  highlighted?: boolean
}) {
  return (
    <Card className={highlighted ? "border-primary ring-1 ring-primary bg-primary/5" : ""}>
      <CardContent className="py-4 px-3 text-center">
        {highlighted ? (
          <Badge className="mb-2 text-xs">Recomendado</Badge>
        ) : (
          <div className="mb-2 h-5" />
        )}
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-xl font-bold tracking-tight ${highlighted ? "text-primary" : ""}`}>
          {formatCurrency(price)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
      </CardContent>
    </Card>
  )
}

export function PriceCalculator() {
  // ── Lote ──────────────────────────────────────────────────────────────────
  const [lotQty, setLotQty] = useState(10)
  const [productMode, setProductMode] = useState<"unit" | "lot">("lot")
  const [productValue, setProductValue] = useState(400) // total do lote ou por unidade
  const [freightMode, setFreightMode] = useState<"unit" | "lot">("lot")
  const [freightValue, setFreightValue] = useState(50)  // total do lote ou por unidade

  // ── Custos adicionais por unidade ─────────────────────────────────────────
  const [packaging, setPackaging] = useState(2)
  const [outboundShipping, setOutboundShipping] = useState(0)

  // ── Marketing ─────────────────────────────────────────────────────────────
  const [marketingEnabled, setMarketingEnabled] = useState(false)
  const [marketingBudget, setMarketingBudget] = useState(0)

  // ── Taxas ─────────────────────────────────────────────────────────────────
  const [platformFee, setPlatformFee] = useState(2)
  const [gatewayFee, setGatewayFee] = useState(3)
  const [tax, setTax] = useState(6)

  // ── Margem ────────────────────────────────────────────────────────────────
  const [margin, setMargin] = useState(30)

  // ── Derived per-unit costs ────────────────────────────────────────────────
  const safeQty = lotQty > 0 ? lotQty : 1
  const productCostPerUnit = productMode === "unit" ? productValue : productValue / safeQty
  const inboundFreightPerUnit = freightMode === "unit" ? freightValue : freightValue / safeQty
  const marketingPerUnit = marketingEnabled && marketingBudget > 0 ? marketingBudget / safeQty : 0

  const fixedCost =
    productCostPerUnit + inboundFreightPerUnit + packaging + outboundShipping + marketingPerUnit
  const pctFees = platformFee + gatewayFee + tax

  const minPrice = calcPrice(fixedCost, pctFees, 0)
  const idealPrice = calcPrice(fixedCost, pctFees, margin)
  const premiumPrice = calcPrice(fixedCost, pctFees, margin + 20)

  const platformAmt = (idealPrice * platformFee) / 100
  const gatewayAmt = (idealPrice * gatewayFee) / 100
  const taxAmt = (idealPrice * tax) / 100
  const profitAmt = (idealPrice * margin) / 100

  const breakdown = [
    { label: "Produto (por un.)", value: productCostPerUnit, color: "bg-blue-500" },
    { label: "Frete de entrada (por un.)", value: inboundFreightPerUnit, color: "bg-blue-300" },
    { label: "Embalagem", value: packaging, color: "bg-slate-400" },
    { label: "Envio ao cliente", value: outboundShipping, color: "bg-slate-300" },
    { label: "Marketing (por un.)", value: marketingPerUnit, color: "bg-purple-400" },
    { label: "Taxa da plataforma", value: platformAmt, color: "bg-orange-400" },
    { label: "Taxa do gateway", value: gatewayAmt, color: "bg-orange-300" },
    { label: "Imposto", value: taxAmt, color: "bg-red-400" },
    { label: "Lucro", value: profitAmt, color: "bg-emerald-500" },
  ].filter((b) => b.value > 0.005)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs ── */}
      <div className="space-y-4">

        {/* Lote */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dados do lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              id="lot-qty"
              label="Quantidade de peças compradas"
              hint="Quantas unidades você comprou nesse lote?"
              value={lotQty}
              onChange={setLotQty}
              suffix="un."
              max={99999}
            />

            {/* Custo do produto com toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm">Custo do produto</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Valor pago ao fornecedor. Escolha se quer informar o valor por unidade ou o valor total do lote.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex rounded-md border overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setProductMode("unit")}
                    className={`px-2.5 py-1 transition-colors ${productMode === "unit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    Por unidade
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductMode("lot")}
                    className={`px-2.5 py-1 transition-colors ${productMode === "lot" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    Total do lote
                  </button>
                </div>
              </div>
              <NumericInput value={productValue} onChange={setProductValue} prefix="R$" />
              {productMode === "lot" && lotQty > 0 && (
                <p className="text-xs text-muted-foreground">= {formatCurrency(productCostPerUnit)}/un.</p>
              )}
            </div>

            {/* Frete com toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm">Frete de entrada</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Frete pago para receber o lote no seu estoque. Escolha se quer informar por unidade ou o total do lote.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex rounded-md border overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setFreightMode("unit")}
                    className={`px-2.5 py-1 transition-colors ${freightMode === "unit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    Por unidade
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreightMode("lot")}
                    className={`px-2.5 py-1 transition-colors ${freightMode === "lot" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    Total do lote
                  </button>
                </div>
              </div>
              <NumericInput value={freightValue} onChange={setFreightValue} prefix="R$" />
              {freightMode === "lot" && lotQty > 0 && (
                <p className="text-xs text-muted-foreground">= {formatCurrency(inboundFreightPerUnit)}/un.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Custos adicionais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Custos adicionais por unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              id="packaging"
              label="Embalagem"
              hint="Custo de embalagem, etiqueta, fita e materiais por unidade."
              value={packaging}
              onChange={setPackaging}
              prefix="R$"
            />
            <Field
              id="outbound-shipping"
              label="Envio ao cliente"
              hint="Custo de frete para enviar ao comprador. Use 0 se o cliente paga o frete ou se você absorve no preço."
              value={outboundShipping}
              onChange={setOutboundShipping}
              prefix="R$"
            />
          </CardContent>
        </Card>

        {/* Marketing */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Marketing</CardTitle>
              <Switch
                checked={marketingEnabled}
                onCheckedChange={setMarketingEnabled}
                aria-label="Habilitar marketing"
              />
            </div>
          </CardHeader>
          {marketingEnabled && (
            <CardContent>
              <Field
                id="marketing-budget"
                label="Investimento em marketing para este lote"
                hint={`Total que você vai gastar em anúncios (Meta Ads, Google Ads, influencers) para vender este lote de ${safeQty} peças. Será dividido por unidade automaticamente.`}
                value={marketingBudget}
                onChange={setMarketingBudget}
                prefix="R$"
              />
              {marketingBudget > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  = {formatCurrency(marketingPerUnit)}/un. &nbsp;(R${marketingBudget.toFixed(0)} ÷ {safeQty} peças)
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Taxas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Taxas e impostos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              id="platform-fee"
              label="Taxa da plataforma"
              hint="Taxa cobrada pela plataforma de vendas sobre cada venda. Shopify: ~2%, Mercado Livre: ~15–17%, Nuvemshop: ~1%."
              value={platformFee}
              onChange={setPlatformFee}
              suffix="%"
              max={50}
            />
            <Field
              id="gateway-fee"
              label="Taxa do gateway"
              hint="Taxa do processador de pagamento. Cartão de crédito: ~3–3,5%, PIX: ~1%, Boleto: ~2%."
              value={gatewayFee}
              onChange={setGatewayFee}
              suffix="%"
              max={20}
            />
            <Field
              id="tax"
              label="Imposto"
              hint="Alíquota sobre o faturamento. Simples Nacional Anexo I: ~4–6%, Anexo II: ~4,5–7%. MEI: isento sobre vendas de produtos até o limite."
              value={tax}
              onChange={setTax}
              suffix="%"
              max={30}
            />
          </CardContent>
        </Card>

        {/* Margem */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-baseline">
              <CardTitle className="text-base">Margem de lucro desejada</CardTitle>
              <span className="text-3xl font-bold text-primary">{margin}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Slider
              min={0}
              max={70}
              step={1}
              value={[margin]}
              onValueChange={(v) => setMargin(v[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0% — empatar</span>
              <span>30% — saudável</span>
              <span>50%+ — premium</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Results ── */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="grid grid-cols-3 gap-3">
          <PriceTier label="Mínimo" sublabel="Só empata custos" price={minPrice} />
          <PriceTier label="Ideal" sublabel={`${margin}% de margem`} price={idealPrice} highlighted />
          <PriceTier label="Premium" sublabel={`${margin + 20}% de margem`} price={premiumPrice} />
        </div>

        {/* Lote summary */}
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resumo do lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo total do lote</span>
              <span className="font-medium">{formatCurrency((productCostPerUnit + inboundFreightPerUnit) * safeQty)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo por peça (compra)</span>
              <span className="font-medium">{formatCurrency(productCostPerUnit + inboundFreightPerUnit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo total por unidade</span>
              <span className="font-medium">{formatCurrency(fixedCost)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Receita ideal do lote</span>
              <span className="font-bold text-emerald-600">{formatCurrency(idealPrice * safeQty)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lucro estimado do lote</span>
              <span className="font-bold text-primary">{formatCurrency(profitAmt * safeQty)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Composição do preço ideal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map((item) => {
              const pct = idealPrice > 0 ? (item.value / idealPrice) * 100 : 0
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="tabular-nums">
                      {formatCurrency(item.value)}{" "}
                      <span className="text-muted-foreground text-xs">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="pt-2 border-t flex justify-between font-semibold">
              <span>Preço ideal</span>
              <span className="text-primary">{formatCurrency(idealPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Mínimo</strong> — nunca venda abaixo disso, você estará no prejuízo.{" "}
              <strong>Ideal</strong> — sua margem alvo considerando todos os custos e taxas.{" "}
              <strong>Premium</strong> — para posicionamento superior, kits ou produtos exclusivos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
