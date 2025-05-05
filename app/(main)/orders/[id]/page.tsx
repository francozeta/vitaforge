"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Package, Truck, CreditCard, RefreshCw } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderDetailSkeleton } from "@/components/skeletons/order-detail-skeleton"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
}

interface PaymentDetails {
  method: string
  transactionId: string
  amount: number
  currency: string
  paidAt: string
}

interface Order {
  _id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  totalAmount: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentDetails?: PaymentDetails
}

export default function OrderDetailsPage() {
  const { session, isLoading: authLoading } = useAuth({ required: true })
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const fetchOrder = async () => {
    if (!orderId || isLoading) return

    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`)

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/orders")
          return
        }
        throw new Error("Error al cargar el pedido")
      }

      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error al cargar el pedido:", error)
      setLoadError("No se pudo cargar el pedido. Intenta de nuevo más tarde.")
    } finally {
      setIsLoading(false)
      setInitialLoadDone(true)
    }
  }

  // Cargar la orden solo una vez al montar el componente
  useEffect(() => {
    if (!authLoading && session && !initialLoadDone && orderId) {
      fetchOrder()
    }
  }, [session, authLoading, initialLoadDone, orderId])

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <OrderDetailSkeleton />
      </div>
    )
  }

  // Mostrar pantalla de carga inicial
  if (isLoading && !initialLoadDone) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <OrderDetailSkeleton />
      </div>
    )
  }

  // Mostrar mensaje de error si hay algún problema
  if (loadError) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a mis pedidos
            </Link>
          </Button>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-500">{loadError}</p>
              <Button onClick={fetchOrder} disabled={isLoading}>
                {isLoading ? "Cargando..." : "Intentar de nuevo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a mis pedidos
            </Link>
          </Button>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Package className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Pedido no encontrado</h2>
              <p className="text-muted-foreground">El pedido que buscas no existe o no tienes acceso a él.</p>
              <Button asChild className="mt-4">
                <Link href="/orders">Ver mis pedidos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a mis pedidos
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrder}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Pedido #{order._id.substring(order._id.length - 8)}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
          <Badge className={getStatusColor(order.paymentStatus)}>{getStatusText(order.paymentStatus)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="py-5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item._id}`} className="font-medium hover:underline line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">{formatCurrency(item.price)} c/u</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      {/* Precio en móvil */}
                      <div className="text-right sm:hidden absolute right-4">
                        <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="py-5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Información de envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
                {order.shippingAddress.phone && <p className="text-sm">Tel: {order.shippingAddress.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {order.paymentDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Información de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Método</span>
                    <span className="text-sm font-medium capitalize">{order.paymentDetails.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ID de transacción</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {order.paymentDetails.transactionId.substring(0, 10)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fecha</span>
                    <span className="text-sm font-medium">
                      {new Date(order.paymentDetails.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
