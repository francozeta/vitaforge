"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight, ChevronLeft, Archive, RefreshCw } from "lucide-react"
import { OrderSkeleton } from "@/components/skeletons/order-skeleton"

interface Order {
  _id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  totalAmount: number
  createdAt: string
  items: Array<{
    _id: string
    name: string
    quantity: number
  }>
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function OrdersPage() {
  const { session, isLoading: authLoading } = useAuth({ required: true })
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Función para cargar órdenes manualmente
  const fetchOrders = async (page = 1) => {
    if (isLoading) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await fetch(`/api/orders?page=${page}&limit=10`)
      const data = await response.json()

      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error al cargar órdenes:", error)
      setLoadError("No se pudieron cargar los pedidos. Intenta de nuevo más tarde.")
    } finally {
      setIsLoading(false)
      setInitialLoadDone(true)
    }
  }

  // Cargar órdenes solo una vez al montar el componente
  useEffect(() => {
    if (!authLoading && session && !initialLoadDone) {
      fetchOrders()
    }
  }, [session, authLoading, initialLoadDone])

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage)
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>
        <OrderSkeleton />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "paid":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      case "paid":
        return "Pagado"
      case "failed":
        return "Fallido"
      case "refunded":
        return "Reembolsado"
      default:
        return status
    }
  }

  // Mostrar pantalla de carga inicial
  if (isLoading && !initialLoadDone) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>
        <OrderSkeleton />
      </div>
    )
  }

  // Mostrar mensaje de error si hay algún problema
  if (loadError) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-500">{loadError}</p>
              <Button onClick={() => fetchOrders()} disabled={isLoading}>
                {isLoading ? "Cargando..." : "Intentar de nuevo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar mensaje cuando no hay órdenes
  if (initialLoadDone && orders.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Pedidos</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders()}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Archive className="h-12 w-12 text-neutral-900" />
              <h2 className="text-xl font-semibold">No tienes pedidos</h2>
              <p className="text-muted-foreground">Aún no has realizado ningún pedido.</p>
              <Button asChild className="mt-4">
                <Link href="/products">Ver Productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Pedidos</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(pagination.page)}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id} className="overflow-hidden py-5">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-lg">Pedido #{order._id.substring(order._id.length - 8)}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} - {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  <Badge className={getStatusColor(order.paymentStatus)}>{getStatusText(order.paymentStatus)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Productos</h3>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item._id} className="flex justify-between text-sm">
                        <span className="line-clamp-1 flex-1">
                          {item.name} x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t">
                  <div>
                    <p className="font-medium">Total: {formatCurrency(order.totalAmount)}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/orders/${order._id}`}>
                      Ver detalles
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Paginación */}
        {pagination.pages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            {/* Mostrar solo algunos números de página en móvil */}
            {Array.from({ length: pagination.pages }, (_, i) => {
              // En móvil, mostrar solo la página actual, la primera, la última y una página antes/después
              const pageNum = i + 1
              const isCurrentPage = pagination.page === pageNum
              const isFirstPage = pageNum === 1
              const isLastPage = pageNum === pagination.pages
              const isNearCurrentPage = Math.abs(pageNum - pagination.page) <= 1

              // Mostrar siempre en pantallas grandes
              const showOnDesktop = true
              // Mostrar en móvil solo si es la página actual, primera, última o cercana
              const showOnMobile = isCurrentPage || isFirstPage || isLastPage || isNearCurrentPage

              if (!showOnMobile) {
                return null
              }

              return (
                <Button
                  key={pageNum}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || isLoading}
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
