"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any | null
  onSave: (product: any) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    cost: 0,
    price: 0,
    margin: 30,
    stock: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Atualiza o formulário quando o produto muda
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        cost: product.cost,
        price: product.price,
        margin: product.margin,
        stock: product.stock,
        createdAt: product.createdAt,
      })
    } else {
      setFormData({
        name: "",
        cost: 0,
        price: 0,
        margin: 30,
        stock: 0,
      })
    }
    setErrors({})
  }, [product, open])

  // Atualiza o preço quando o custo ou a margem mudam
  useEffect(() => {
    if (formData.cost > 0 && formData.margin > 0) {
      const calculatedPrice = formData.cost / (1 - formData.margin / 100)
      setFormData((prev: any) => ({
        ...prev,
        price: Number(calculatedPrice.toFixed(2)),
      }))
    }
  }, [formData.cost, formData.margin])

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))

    // Limpa o erro do campo quando ele é alterado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (formData.cost <= 0) {
      newErrors.cost = "Custo deve ser maior que zero"
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero"
    }

    if (formData.margin <= 0 || formData.margin >= 100) {
      newErrors.margin = "Margem deve estar entre 1% e 99%"
    }

    if (formData.stock < 0) {
      newErrors.stock = "Estoque não pode ser negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
                className={errors.margin ? "border-red-500" : ""}
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
              <Label htmlFor="stock">Estoque (unidades)</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
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
