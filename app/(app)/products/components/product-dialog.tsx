"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { X, Plus } from "lucide-react"
import type { ProductVariant } from "@/contexts/products-context"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any | null
  onSave: (product: any) => void
}

const PRESET_SIZES = ["P", "M", "G", "GG"]

function uid() { return Math.random().toString(36).slice(2, 9) }

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    cost: 0,
    price: 0,
    margin: 30,
    stock: 0,
    variants: [] as ProductVariant[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const computedVariantStock: number = formData.variants.reduce((s: number, v: ProductVariant) => s + v.stock, 0)
  const hasVariants: boolean = formData.variants.length > 0

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        cost: product.cost,
        price: product.price,
        margin: product.margin,
        stock: product.stock,
        variants: product.variants ?? [],
        createdAt: product.createdAt,
      })
    } else {
      setFormData({ name: "", cost: 0, price: 0, margin: 30, stock: 0, variants: [] })
    }
    setErrors({})
  }, [product, open])

  useEffect(() => {
    if (formData.cost > 0 && formData.margin > 0) {
      const calculatedPrice = formData.cost / (1 - formData.margin / 100)
      setFormData((prev: any) => ({ ...prev, price: Number(calculatedPrice.toFixed(2)) }))
    }
  }, [formData.cost, formData.margin])

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
    }
  }

  function addPresetVariant(size: string) {
    const already = formData.variants.find((v: ProductVariant) => v.size === size)
    if (already) return
    setFormData((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { id: uid(), size, color: "Padrão", stock: 0 }],
    }))
  }

  function addEmptyVariant() {
    setFormData((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { id: uid(), size: "", color: "", stock: 0 }],
    }))
  }

  function updateVariantField(id: string, field: keyof ProductVariant, value: string | number) {
    setFormData((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: ProductVariant) => v.id === id ? { ...v, [field]: value } : v),
    }))
  }

  function removeVariant(id: string) {
    setFormData((prev: any) => ({
      ...prev,
      variants: prev.variants.filter((v: ProductVariant) => v.id !== id),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (formData.cost <= 0) newErrors.cost = "Custo deve ser maior que zero"
    if (formData.price <= 0) newErrors.price = "Preço deve ser maior que zero"
    if (formData.margin <= 0 || formData.margin >= 100) newErrors.margin = "Margem deve estar entre 1% e 99%"
    if (!hasVariants && formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        stock: hasVariants ? computedVariantStock : formData.stock,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleChange("cost", Number(e.target.value))}
                className={errors.cost ? "border-red-500" : ""}
              />
              {errors.cost && <p className="text-xs text-red-500">{errors.cost}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="margin">Margem de Lucro</Label>
                <span className="text-sm text-muted-foreground">{formData.margin}%</span>
              </div>
              <Slider
                id="margin"
                min={1}
                max={99}
                step={1}
                value={[formData.margin]}
                onValueChange={(value) => handleChange("margin", value[0])}
              />
              {errors.margin && <p className="text-xs text-red-500">{errors.margin}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Estoque
                {hasVariants && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    — {computedVariantStock} un. (calculado pelas variantes)
                  </span>
                )}
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={hasVariants ? computedVariantStock : formData.stock}
                disabled={hasVariants}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
            </div>

            {/* ── Variants ── */}
            <div className="space-y-3 pt-1 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Variantes de Tamanho / Cor</Label>
                {hasVariants && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => setFormData((p: any) => ({ ...p, variants: [] }))}
                  >
                    Remover todas
                  </button>
                )}
              </div>

              {!hasVariants ? (
                <div className="rounded-lg border border-dashed p-4 text-center space-y-3">
                  <p className="text-xs text-muted-foreground">Sem variantes — estoque único</p>
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {PRESET_SIZES.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => addPresetVariant(size)}
                      >
                        {size}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={addEmptyVariant}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Personalizado
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_72px_32px] gap-1.5 px-1">
                    <span className="text-xs text-muted-foreground">Tamanho</span>
                    <span className="text-xs text-muted-foreground">Cor</span>
                    <span className="text-xs text-muted-foreground text-right">Qtd</span>
                    <span />
                  </div>

                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
                    {formData.variants.map((v: ProductVariant) => (
                      <div key={v.id} className="grid grid-cols-[1fr_1fr_72px_32px] gap-1.5 items-center">
                        <Input
                          value={v.size}
                          onChange={(e) => updateVariantField(v.id, "size", e.target.value)}
                          placeholder="P / M / 38…"
                          className="h-8 text-sm"
                        />
                        <Input
                          value={v.color}
                          onChange={(e) => updateVariantField(v.id, "color", e.target.value)}
                          placeholder="Preto, Rosa…"
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => updateVariantField(v.id, "stock", Math.max(0, Number(e.target.value)))}
                          className="h-8 text-sm text-right"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeVariant(v.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {PRESET_SIZES.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => addPresetVariant(size)}
                      >
                        + {size}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={addEmptyVariant}
                    >
                      + Variante
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
