"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

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

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders?limit=5")
        const data = await response.json()
        setOrders(data.orders)
      } catch (error) {
        console.error("Error al cargar órdenes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No tienes pedidos anteriores.</p>
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
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order._id.substring(order._id.length - 8)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  <Badge className={getStatusColor(order.paymentStatus)}>{getStatusText(order.paymentStatus)}</Badge>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                  </p>
                  <p className="text-sm text-gray-500">Total: {formatCurrency(order.totalAmount)}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs">
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

      <div className="text-center mt-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/orders">Ver todos los pedidos</Link>
        </Button>
      </div>
    </div>
  )
}
