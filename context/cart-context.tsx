"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Añadir un item al carrito
  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id)

      if (existingItemIndex >= 0) {
        // Si existe, actualizar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Si no existe, añadir nuevo item
        return [...prevItems, item]
      }
    })
  }

  // Actualizar cantidad de un item
  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  // Eliminar un item del carrito
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id))
  }

  // Vaciar el carrito
  const clearCart = () => {
    setItems([])
  }

  // Calcular número total de items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calcular precio total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
