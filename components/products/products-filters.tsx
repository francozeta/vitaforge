"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

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
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Categorías</h3>
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-32" />
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
          </div>

          {selectedCategory && (
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="w-full mt-4">
              Limpiar filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
