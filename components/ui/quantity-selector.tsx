"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  min?: number
  max?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

export function QuantitySelector({ min = 1, max = 99, defaultValue = 1, onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultValue)

  const increment = () => {
    const newValue = Math.min(quantity + 1, max)
    setQuantity(newValue)
    onChange?.(newValue)
  }

  const decrement = () => {
    const newValue = Math.max(quantity - 1, min)
    setQuantity(newValue)
    onChange?.(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) return

    const newValue = Math.max(Math.min(value, max), min)
    setQuantity(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 md:h-9 md:w-9 rounded-r-none text-xs md:text-sm"
        onClick={decrement}
        disabled={quantity <= min}
      >
        <Minus className="h-3 w-3 md:h-4 md:w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        className="h-8 md:h-9 w-10 md:w-14 rounded-none border-x-0 text-center text-xs md:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 md:h-9 md:w-9 rounded-l-none text-xs md:text-sm"
        onClick={increment}
        disabled={quantity >= max}
      >
        <Plus className="h-3 w-3 md:h-4 md:w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  )
}
