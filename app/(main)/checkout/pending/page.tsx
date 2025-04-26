"use client"

import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPendingPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Pago pendiente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
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
