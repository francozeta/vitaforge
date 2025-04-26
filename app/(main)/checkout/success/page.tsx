"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [hasCleared, setHasCleared] = useState(false)

  useEffect(() => {
    // Solo limpiar el carrito una vez y marcar como limpiado
    if (!hasCleared) {
      clearCart()
      setHasCleared(true)
    }
  }, [clearCart, hasCleared])

  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Pago completado con éxito!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            Tu pedido ha sido procesado correctamente. Recibirás un correo electrónico con los detalles de tu compra.
          </p>

          <div className="flex flex-col space-y-2">
            <Button onClick={() => router.push("/account/orders")}>Ver mis pedidos</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Volver a la tienda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
