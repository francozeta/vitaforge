"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight, ChevronLeft, Package, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  totalAmount: number
  createdAt: string
  items: OrderItem[]
  user: {
    _id: string
    name: string
    email: string
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function AdminOrdersPage() {
  const { session, isLoading: authLoading } = useAuth({ required: true, requiredRole: "admin" })
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
  const [statusFilter, setStatusFilter] = useState<string>("")

  // Función para cargar órdenes manualmente
  const fetchOrders = async (page = 1, status = statusFilter) => {
    if (isLoading) return

    setIsLoading(true)
    setLoadError(null)

    try {
      let url = `/api/admin/orders?page=${page}&limit=10`
      if (status && status !== "all") {
        url += `&status=${status}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Error al cargar órdenes")
      }

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
    if (!authLoading && session && session.user.role === "admin" && !initialLoadDone) {
      fetchOrders()
    }
  }, [session, authLoading, initialLoadDone])

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    fetchOrders(1, value)
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      </div>
    )
  }

  // Verificar si el usuario es administrador
  if (!authLoading && session && session.user?.role !== "admin") {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Acceso Denegado</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold">No tienes permisos para acceder a esta página</h2>
              <p className="text-muted-foreground">Esta sección está reservada para administradores.</p>
              <Button asChild className="mt-4">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar pantalla de carga inicial
  if (isLoading && !initialLoadDone) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
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

  // Mostrar mensaje de error si hay algún problema
  if (loadError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(pagination.page, statusFilter)}
            disabled={isLoading}
            className="flex items-center gap-1 mr-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Actualizando..." : "Actualizar"}
          </Button>
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Package className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No hay pedidos</h2>
              <p className="text-muted-foreground">
                {statusFilter
                  ? `No hay pedidos con estado "${getStatusText(statusFilter)}"`
                  : "No hay pedidos disponibles"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order._id.substring(order._id.length - 8)}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} -{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    <Badge className={getStatusColor(order.paymentStatus)}>{getStatusText(order.paymentStatus)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Cliente</h3>
                    <p className="text-sm">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Productos</h3>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item._id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <p className="font-medium">Total: {formatCurrency(order.totalAmount)}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order._id}`}>
                        Gestionar
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
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || isLoading}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
