"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  listProducts,
  createProduct,
  updateProductAction,
  deleteProductAction,
  type ProductDTO,
} from "@/app/actions/products"

export interface ProductVariant {
  id: string
  size: string
  color: string
  stock: number
}

export interface Product {
  id: number
  name: string
  cost: number
  price: number
  margin: number
  stock: number
  variants: ProductVariant[]
  createdAt: Date
}

export function getProductStock(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((s, v) => s + v.stock, 0)
  }
  return product.stock
}

function fromDTO(d: ProductDTO): Product {
  return { ...d, createdAt: new Date(d.createdAt) }
}

function toDTO(p: Product): ProductDTO {
  return { ...p, createdAt: p.createdAt.toISOString() }
}

interface ProductsContextType {
  products: Product[]
  loading: boolean
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
  getTotalProducts: () => number
  getAverageCost: () => number
  getAveragePrice: () => number
  getAverageMargin: () => number
  getTotalStock: () => number
  getNewProducts: (days: number) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listProducts()
      .then((rows) => setProducts(rows.map(fromDTO)))
      .catch((error) => {
        console.error("Failed to load products:", error)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    createProduct({
      name: product.name,
      cost: product.cost,
      price: product.price,
      margin: product.margin,
      stock: product.stock,
      variants: (product.variants ?? []).map((v) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock })),
    })
      .then((rows) => setProducts(rows.map(fromDTO)))
      .catch((error) => console.error("Failed to create product:", error))
  }

  const updateProduct = (product: Product) => {
    // optimistic update
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
    updateProductAction(toDTO(product))
      .then((rows) => setProducts(rows.map(fromDTO)))
      .catch((error) => console.error("Failed to update product:", error))
  }

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    deleteProductAction(id)
      .then((rows) => setProducts(rows.map(fromDTO)))
      .catch((error) => console.error("Failed to delete product:", error))
  }

  const getProductById = (id: number) => products.find((p) => p.id === id)
  const getTotalProducts = () => products.length
  const getAverageCost = () => (products.length === 0 ? 0 : products.reduce((s, p) => s + p.cost, 0) / products.length)
  const getAveragePrice = () => (products.length === 0 ? 0 : products.reduce((s, p) => s + p.price, 0) / products.length)
  const getAverageMargin = () => (products.length === 0 ? 0 : products.reduce((s, p) => s + p.margin, 0) / products.length)
  const getTotalStock = () => products.reduce((s, p) => s + getProductStock(p), 0)
  const getNewProducts = (days: number) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return products.filter((p) => p.createdAt > cutoff)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getTotalProducts,
        getAverageCost,
        getAveragePrice,
        getAverageMargin,
        getTotalStock,
        getNewProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
