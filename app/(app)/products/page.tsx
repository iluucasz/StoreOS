import { ProductsTable } from "@/app/(app)/products/components/products-table"
import { ProductPerformance } from "@/app/(app)/products/components/product-performance"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Produtos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Performance e gerenciamento dos seus produtos em uma tela
      </p>
      <ProductPerformance />
      <ProductsTable />
    </div>
  )
}
