"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, ShoppingBag } from "lucide-react"

export default function CheckoutSuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Recuperar el ID de la orden del localStorage
    const storedOrderId = localStorage.getItem("currentOrderId")
    console.log("OrderId recuperado del localStorage:", storedOrderId)

    if (storedOrderId) {
      setOrderId(storedOrderId)
      // Limpiar el localStorage
      localStorage.removeItem("currentOrderId")
    }

    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const paymentId = urlParams.get("payment_id")
    const status = urlParams.get("status")

    console.log("Parámetros de éxito:", { paymentId, status, orderId: storedOrderId })
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="text-center py-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Compra Exitosa!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu
            compra.
          </p>

          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">Número de pedido</p>
              <p className="font-medium">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/orders" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver mis pedidos
              </Link>
            </Button>
            <Button asChild>
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
