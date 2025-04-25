"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    price: number
    images?: { url: string }[]
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0]?.url,
    })

    toast.success(`${product.name} añadido al carrito`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
      <QuantitySelector defaultValue={1} onChange={setQuantity} />
      <Button onClick={handleAddToCart} className="flex-1 text-sm md:text-base">
        Agregar al carrito
      </Button>
    </div>
  )
}
