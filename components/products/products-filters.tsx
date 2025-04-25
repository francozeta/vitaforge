"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tag } from "lucide-react"

interface Category {
  _id: string
  name: string
}

export default function ProductsFilters({ selectedCategory }: { selectedCategory?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?active=true")
        if (!response.ok) throw new Error("Error al cargar categorías")

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    // Si ya está seleccionada, quitar el filtro
    if (categoryId === selectedCategory) {
      router.push(pathname)
    } else {
      router.push(`${pathname}?category=${categoryId}`)
    }
  }

  const handleClearFilters = () => {
    router.push(pathname)
  }

  return (
    <Card className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4 border-b pb-3">
          <Tag className="h-4 w-4" />
          <h2 className="font-medium">Categorías</h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 md:h-4 w-24 md:w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={category._id === selectedCategory}
                  onCheckedChange={() => handleCategoryChange(category._id)}
                />
                <Label htmlFor={`category-${category._id}`} className="text-sm cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full mt-4 text-xs md:text-sm h-8"
          >
            Limpiar filtros
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
