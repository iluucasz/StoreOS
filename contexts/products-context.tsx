"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  cost: number
  price: number
  margin: number
  stock: number
  createdAt: Date
}

// Dados iniciais de produtos
const initialProducts: Product[] = [
  { id: 1, name: "Blusa Feminina", cost: 35, price: 89.9, margin: 30, stock: 15, createdAt: new Date(2023, 6, 15) },
  { id: 2, name: "Calça Jeans", cost: 45, price: 129.9, margin: 35, stock: 10, createdAt: new Date(2023, 6, 10) },
  { id: 3, name: "Vestido Casual", cost: 50, price: 149.9, margin: 40, stock: 8, createdAt: new Date(2023, 6, 5) },
  { id: 4, name: "Saia Midi", cost: 30, price: 79.9, margin: 32, stock: 12, createdAt: new Date(2023, 5, 28) },
  { id: 5, name: "Conjunto Verão", cost: 48, price: 139.9, margin: 38, stock: 5, createdAt: new Date(2023, 5, 20) },
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
    // Tenta carregar produtos do localStorage
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        // Converte as strings de data de volta para objetos Date
        return JSON.parse(savedProducts, (key, value) => {
          if (key === "createdAt") {
            return new Date(value)
          }
          return value
        })
      }
    }
    return initialProducts
  })

  // Salva produtos no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct = {
      ...product,
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

  const getProductById = (id: number) => {
    return products.find((p) => p.id === id)
  }

  const getTotalProducts = () => {
    return products.length
  }

  const getAverageCost = () => {
    if (products.length === 0) return 0
    const totalCost = products.reduce((sum, product) => sum + product.cost, 0)
    return totalCost / products.length
  }

  const getAveragePrice = () => {
    if (products.length === 0) return 0
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0)
    return totalPrice / products.length
  }

  const getAverageMargin = () => {
    if (products.length === 0) return 0
    const totalMargin = products.reduce((sum, product) => sum + product.margin, 0)
    return totalMargin / products.length
  }

  const getTotalStock = () => {
    return products.reduce((sum, product) => sum + product.stock, 0)
  }

  const getNewProducts = (days: number) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return products.filter((product) => product.createdAt > cutoffDate)
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
