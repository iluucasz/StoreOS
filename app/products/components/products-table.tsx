"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Plus, Search, Facebook, Download } from "lucide-react"
import { downloadCSV } from "@/lib/export-csv"
import { ProductDialog } from "./product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { toast } from "@/components/ui/use-toast"
import { useProducts, getProductStock } from "@/contexts/products-context"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export function ProductsTable() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any | null>(null)

  // Mock data for marketing campaigns
  const mockCampaigns = [
    {
      id: "1",
      name: "Campanha de Verão",
      spend: 1200,
      conversions: 45,
      cpa: 26.67,
      roas: 3.2,
    },
    {
      id: "2",
      name: "Promoção Especial",
      spend: 800,
      conversions: 32,
      cpa: 25.0,
      roas: 3.5,
    },
    {
      id: "3",
      name: "Lançamento Coleção",
      spend: 1500,
      conversions: 60,
      cpa: 25.0,
      roas: 3.8,
    },
  ]

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (product: any) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveProduct = (product: any) => {
    if (product.id) {
      // Editar produto existente
      updateProduct(product)
      toast({
        title: "Produto atualizado",
        description: `${product.name} foi atualizado com sucesso.`,
      })
    } else {
      // Adicionar novo produto
      addProduct(product)
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado com sucesso.`,
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeleteProduct = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id)
      toast({
        title: "Produto excluído",
        description: `${currentProduct.name} foi excluído com sucesso.`,
        variant: "destructive",
      })
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Produtos Cadastrados</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadCSV("produtos.csv", filteredProducts.map(p => ({
                "Nome": p.name,
                "Custo (R$)": p.cost,
                "Preço (R$)": p.price,
                "Margem (%)": p.margin,
                "Estoque": getProductStock(p),
                "Variantes": p.variants?.length ?? 0,
              })))}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/marketing">
                <Facebook className="mr-2 h-4 w-4" />
                Campanhas
              </Link>
            </Button>
            <Button size="sm" onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Custo</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Margem</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">{formatCurrency(product.cost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">{product.margin}%</TableCell>
                      <TableCell className="text-right">
                        <div>{getProductStock(product)}</div>
                        {product.variants?.length > 0 && (
                          <div className="text-xs text-muted-foreground">{product.variants.length} var.</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Métricas de Marketing por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead className="text-right">Gasto</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Conversões</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">CPA</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.spend)}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{campaign.conversions}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{formatCurrency(campaign.cpa)}</TableCell>
                    <TableCell className="text-right">{campaign.roas.toFixed(2)}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/marketing">Ver todas as campanhas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={currentProduct}
        onSave={handleSaveProduct}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteProduct}
        productName={currentProduct?.name || ""}
      />
    </>
  )
}
