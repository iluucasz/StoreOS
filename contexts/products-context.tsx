"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

const initialProducts: Product[] = [
  {
    id: 1, name: "Blusa Feminina", cost: 35, price: 89.9, margin: 30, stock: 0,
    variants: [
      { id: "v1", size: "P", color: "Branco", stock: 5 },
      { id: "v2", size: "M", color: "Branco", stock: 7 },
      { id: "v3", size: "G", color: "Branco", stock: 3 },
    ],
    createdAt: new Date(2023, 6, 15),
  },
  {
    id: 2, name: "Calça Jeans", cost: 45, price: 129.9, margin: 35, stock: 0,
    variants: [
      { id: "v4", size: "38", color: "Azul", stock: 3 },
      { id: "v5", size: "40", color: "Azul", stock: 4 },
      { id: "v6", size: "42", color: "Azul", stock: 3 },
    ],
    createdAt: new Date(2023, 6, 10),
  },
  { id: 3, name: "Vestido Casual", cost: 50, price: 149.9, margin: 40, stock: 8, variants: [], createdAt: new Date(2023, 6, 5) },
  { id: 4, name: "Saia Midi", cost: 30, price: 79.9, margin: 32, stock: 12, variants: [], createdAt: new Date(2023, 5, 28) },
  {
    id: 5, name: "Conjunto Verão", cost: 48, price: 139.9, margin: 38, stock: 0,
    variants: [
      { id: "v7", size: "P", color: "Rosa", stock: 2 },
      { id: "v8", size: "M", color: "Rosa", stock: 3 },
    ],
    createdAt: new Date(2023, 5, 20),
  },
]

interface ProductsContextType {
  products: Product[]
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
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts, (key, value) => {
          if (key === "createdAt") return new Date(value)
          return value
        })
        return parsed.map((p: Product) => ({ ...p, variants: p.variants ?? [] }))
      }
    }
    return initialProducts
  })

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      variants: product.variants ?? [],
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      createdAt: new Date(),
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)))
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const getProductById = (id: number) => products.find((p) => p.id === id)

  const getTotalProducts = () => products.length

  const getAverageCost = () => {
    if (products.length === 0) return 0
    return products.reduce((sum, p) => sum + p.cost, 0) / products.length
  }

  const getAveragePrice = () => {
    if (products.length === 0) return 0
    return products.reduce((sum, p) => sum + p.price, 0) / products.length
  }

  const getAverageMargin = () => {
    if (products.length === 0) return 0
    return products.reduce((sum, p) => sum + p.margin, 0) / products.length
  }

  const getTotalStock = () => products.reduce((sum, p) => sum + getProductStock(p), 0)

  const getNewProducts = (days: number) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return products.filter((p) => p.createdAt > cutoffDate)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
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
