"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, ShoppingBag } from "lucide-react"

export default function CheckoutPendingPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="text-center py-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Pago Pendiente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Tu pago está siendo procesado. Una vez que se complete, actualizaremos el estado de tu pedido.
          </p>

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
