"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface Product {
  _id: string
  name: string
  shortDescription: string
  price: number
  images: {
    url: string
    path: string
  }[]
  featured: boolean
  category: string
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Obtener productos destacados
        const response = await fetch("/api/products?featured=true&limit=4")

        if (!response.ok) {
          throw new Error("Error al cargar productos destacados")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <section className="container px-4 mx-auto py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Productos Destacados</h2>
            <p className="text-muted-foreground">
              Nuestros suplementos más populares, en los que confían atletas de todo el mundo.
            </p>
          </div>
          <Button asChild variant="outline" className="md:self-start">
            <Link href="/products" className="flex items-center">
              Ver Más Productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-square w-full">
                  <Skeleton className="absolute inset-0" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative aspect-square w-full bg-gray-100">
                  <Image
                    src={product.images?.[0]?.url || "/placeholder.svg?height=400&width=400&query=product"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform hover:scale-105"
                    priority={true}
                  />
                  {product.featured && (
                    <Badge className="absolute right-2 top-2 bg-black text-white hover:bg-black/80">Destacado</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
                  <p className="mt-2 font-semibold">{formatCurrency(product.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/products/${product._id}`}>Ver Producto</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
