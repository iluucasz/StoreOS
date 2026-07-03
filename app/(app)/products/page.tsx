import { ProductsTable } from "@/app/(app)/products/components/products-table"
import { ProductPerformance } from "@/app/(app)/products/components/product-performance"
import { Button } from "@/components/ui/button"
import { BarChart3, PackagePlus } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Catálogo e performance</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe estoque, preços, margem e comportamento de compra em uma tela.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/marketing">
              <BarChart3 className="mr-2 h-4 w-4" />
              Marketing
            </Link>
          </Button>
          <Button asChild>
            <Link href="/calculator">
              <PackagePlus className="mr-2 h-4 w-4" />
              Precificar
            </Link>
          </Button>
        </div>
      </div>
      <ProductPerformance />
      <ProductsTable />
    </div>
  )
}
