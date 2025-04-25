"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  sku: string
  category: string
  images: {
    url: string
    path: string
  }[]
  featured: boolean
  isActive: boolean
}

interface Category {
  _id: string
  name: string
}

export default function ProductsPage() {
  const router = useRouter()

  // Estados
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Estados de filtros y paginación
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState("")
  const [activeFilter, setActiveFilter] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Cargar productos
  const loadProducts = async () => {
    setLoading(true)

    try {
      // Construir URL con filtros
      let url = `/api/admin/products?page=${page}&limit=${limit}`

      if (search) url += `&search=${encodeURIComponent(search)}`
      if (categoryFilter && categoryFilter !== "all") url += `&category=${categoryFilter}`
      if (featuredFilter && featuredFilter !== "all") url += `&featured=${featuredFilter}`
      if (activeFilter && activeFilter !== "all") url += `&active=${activeFilter}`

      console.log("Fetching products from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.message || `Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      console.log("Products loaded successfully:", data.products.length)

      setProducts(data.products)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Error details:", error)
      toast.error("Error al cargar productos: " + (error instanceof Error ? error.message : "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")

      if (!response.ok) {
        throw new Error("Error al cargar categorías")
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    loadCategories()
  }, [])

  // Cargar productos cuando cambien los filtros o la paginación
  useEffect(() => {
    loadProducts()
  }, [page, limit, categoryFilter, featuredFilter, activeFilter])

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Resetear página al buscar
    loadProducts()
  }

  // Eliminar producto
  const handleDeleteProduct = async (id: string) => {
    setDeleting(id)

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar producto")
      }

      toast.success("Producto eliminado exitosamente")
      loadProducts() // Recargar productos
    } catch (error) {
      toast.error("Error al eliminar producto")
      console.error(error)
    } finally {
      setDeleting(null)
    }
  }

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price)
  }

  // Obtener nombre de categoría
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : "Sin categoría"
  }

  return (
    <div className="p-8">
      {/* Encabezado con título y botón de crear producto */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => router.push("/admin/products/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={featuredFilter}
                onValueChange={(value) => {
                  setFeaturedFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Destacados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Destacados</SelectItem>
                  <SelectItem value="false">No destacados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={activeFilter}
                onValueChange={(value) => {
                  setActiveFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <div className="relative h-12 w-12">
                        <Image
                          src={product.images[0].url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Sin imagen</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{getCategoryName(product.category)}</TableCell>
                  <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <Badge variant="default" className="bg-green-500">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactivo</Badge>
                    )}
                    {product.featured && (
                      <Badge variant="secondary" className="ml-2">
                        Destacado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el producto
                              <span className="font-semibold"> {product.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {deleting === product._id ? "Eliminando..." : "Eliminar"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {products.length} de {total} productos
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Página {page} de {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number.parseInt(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10 por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
