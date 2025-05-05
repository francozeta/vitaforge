"use client"

import { useState, useEffect, useMemo } from "react"
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
  const [totalProducts, setTotalProducts] = useState(0)

  // Memoize the fetch URL to prevent unnecessary re-fetches
  const fetchUrl = useMemo(() => {
    let url = `/api/products?page=${currentPage}&limit=12`
    if (category) url += `&category=${category}`
    if (search) url += `&search=${encodeURIComponent(search || "")}`

    // Add sorting parameter
    switch (sortOption) {
      case "price-asc":
        url += "&sort=price"
        break
      case "price-desc":
        url += "&sort=-price"
        break
      case "name-asc":
        url += "&sort=name"
        break
      case "name-desc":
        url += "&sort=-name"
        break
      default:
        url += "&sort=-createdAt"
    }

    return url
  }, [category, search, currentPage, sortOption])

  // Optimize the fetch function with AbortController for cleanup
  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(fetchUrl, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error("Error al cargar productos")

        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
        setTotalProducts(data.pagination.total)
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Cleanup function to abort fetch on unmount or dependency change
    return () => controller.abort()
  }, [fetchUrl])

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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-36 md:h-6 md:w-48" />
          <Skeleton className="h-9 w-32 md:h-10 md:w-[180px]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative aspect-square w-full">
                <Skeleton className="absolute inset-0" />
              </div>
              <CardContent className="p-3 md:p-4">
                <Skeleton className="h-4 md:h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 md:h-4 w-full mb-1" />
                <Skeleton className="h-3 md:h-4 w-4/5 mb-1" />
                <Skeleton className="h-4 md:h-5 w-1/4 mt-2" />
              </CardContent>
              <CardFooter className="px-3 pb-3 md:px-4 md:pb-4 pt-0">
                <Skeleton className="h-8 md:h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground text-sm">Intenta con otros filtros o categorías</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <p className="text-xs md:text-sm text-muted-foreground">
          Mostrando {products.length} de {totalProducts} productos
        </p>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="h-9 w-[150px] md:w-[180px] text-xs md:text-sm">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden transition-all hover:shadow-md">
            <Link href={`/products/${product._id}`} className="block relative aspect-square w-full bg-gray-100">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg?height=400&width=400&query=product"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
              {product.featured && (
                <Badge className="absolute right-2 top-2 text-[10px] md:text-xs bg-black text-white hover:bg-black/80">
                  Destacado
                </Badge>
              )}
            </Link>
            <CardContent className="p-3 md:p-4">
              <Link href={`/products/${product._id}`}>
                <h3 className="font-medium text-sm md:text-base line-clamp-1 hover:underline">{product.name}</h3>
              </Link>
              <p className="mt-1 line-clamp-2 text-xs md:text-sm text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="font-semibold text-sm md:text-base">{formatCurrency(product.price)}</p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-xs md:text-sm text-muted-foreground line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="px-3 pb-3 md:px-4 md:pb-4 pt-0">
              <Button asChild className="w-full h-8 md:h-10 text-xs md:text-sm">
                <Link href={`/products/${product._id}`}>Ver Producto</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {pageNumber}
                  </Button>
                )
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                // Mostrar puntos suspensivos
                return (
                  <span key={pageNumber} className="px-1">
                    ...
                  </span>
                )
              }
              return null
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
