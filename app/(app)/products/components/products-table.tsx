"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BarChart3, Download, PackageSearch, Search, ShoppingBag } from "lucide-react"
import { EmptyState, ErrorState, IntegrationRequired, LoadingState } from "@/components/feedback-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { downloadCSV } from "@/lib/export-csv"
import { formatCurrency } from "@/lib/utils"

type ShopifyProduct = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  unitCost: number
  price: number
}

type InventoryResponse = {
  configured?: boolean
  items?: ShopifyProduct[]
  error?: string
}

async function readJson(response: Response): Promise<InventoryResponse> {
  try {
    return await response.json()
  } catch {
    return { error: "Resposta inesperada do servidor." }
  }
}

export function ProductsTable() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/shopify/inventory", { cache: "no-store" })
      const json = await readJson(response)

      if (json.configured === false) {
        setConfigured(false)
        setProducts([])
        return
      }

      setConfigured(true)

      if (!response.ok || json.error) {
        setError(json.error || "Não foi possível carregar produtos da Shopify.")
        setProducts([])
        return
      }

      setProducts(json.items ?? [])
    } catch {
      setError("Não foi possível conectar ao servidor agora.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [products, searchTerm],
  )

  const marginOf = (product: ShopifyProduct) =>
    product.unitCost > 0 && product.price > 0 ? Math.round((1 - product.unitCost / product.price) * 100) : null

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Catálogo Shopify
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={filtered.length === 0}
            onClick={() =>
              downloadCSV(
                "produtos.csv",
                filtered.map((product) => ({
                  Nome: product.name,
                  SKU: product.sku,
                  Categoria: product.category,
                  "Custo (R$)": product.unitCost,
                  "Preço (R$)": product.price,
                  "Margem (%)": marginOf(product) ?? "",
                  Estoque: product.stock,
                })),
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/marketing">
              <BarChart3 className="mr-2 h-4 w-4" />
              Campanhas
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingState label="Carregando produtos da Shopify..." />
        ) : !configured ? (
          <IntegrationRequired
            service="Shopify"
            description="Conecte a loja em Integrações para listar produtos, estoque, custo e preço."
          />
        ) : error ? (
          <ErrorState description={error} onAction={() => void loadProducts()} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto sincronizado"
            description="Quando a Shopify retornar produtos, eles aparecem aqui com estoque, custo, preço e margem."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Custo</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Margem</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((product) => {
                    const margin = marginOf(product)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                          <div className="text-xs text-muted-foreground sm:hidden">{product.category}</div>
                        </TableCell>
                        <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                          {product.sku}
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">
                          {product.unitCost > 0 ? formatCurrency(product.unitCost) : "-"}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="hidden text-right sm:table-cell">{margin !== null ? `${margin}%` : "-"}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              product.stock <= 0
                                ? "font-semibold text-red-500"
                                : product.stock <= 5
                                  ? "font-medium text-amber-600"
                                  : ""
                            }
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nenhum produto encontrado para essa busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Catálogo sincronizado da Shopify. O gerenciamento continua no painel da loja.
        </p>
      </CardContent>
    </Card>
  )
}
