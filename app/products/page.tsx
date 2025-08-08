import { ProductsTable } from "@/app/products/components/products-table"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Produtos</h1>
      <ProductsTable />
    </div>
  )
}
