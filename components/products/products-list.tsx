"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  _id: string
  name: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  images: {
    url: string
    path: string
  }[]
  featured: boolean
  category: string
}

interface ProductsListProps {
  category?: string
  search?: string
  page?: number
  sort?: string
}

export default function ProductsList({ category, search, page = 1, sort }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(page)
  const [sortOption, setSortOption] = useState(sort || "newest")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Construir URL con parámetros
        let url = `/api/products?page=${currentPage}&limit=9`

        if (category) url += `&category=${category}`
        if (search) url += `&search=${encodeURIComponent(search)}`

        // Añadir ordenamiento
        switch (sortOption) {
          case "price-asc":
            url += "&sort=price"
            break
          case "price-desc":
            url += "&sort=-price"
            break
          case "name":
            url += "&sort=name"
            break
          default:
            url += "&sort=-createdAt" // Por defecto, más recientes primero
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Error al cargar productos")

        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, search, currentPage, sortOption])

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Manejar cambio de ordenamiento
  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1) // Resetear a la primera página al cambiar el ordenamiento
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative aspect-square w-full">
                <Skeleton className="absolute inset-0" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-4/5 mb-1" />
                <Skeleton className="h-5 w-1/4 mt-2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground">Intenta con otros filtros o categorías</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Mostrando {products.length} productos</p>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="name">Nombre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square w-full bg-gray-100">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg?height=400&width=400&query=product"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform hover:scale-105"
              />
              {product.featured && (
                <Badge className="absolute right-2 top-2 bg-black text-white hover:bg-black/80">Destacado</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="font-semibold">{formatCurrency(product.price)}</p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-sm text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/products/${product._id}`}>Ver Producto</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1
              // Mostrar siempre la primera, última y páginas cercanas a la actual
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                )
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                // Mostrar puntos suspensivos
                return <span key={pageNumber}>...</span>
              }
              return null
            })}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
