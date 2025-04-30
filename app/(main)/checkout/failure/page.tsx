"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, ShoppingCart } from "lucide-react"

export default function CheckoutFailurePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="text-center py-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Pago Fallido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Lo sentimos, hubo un problema al procesar tu pago. No se ha realizado ningún cargo a tu cuenta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Volver al carrito
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
