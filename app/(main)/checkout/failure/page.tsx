"use client"

import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutFailurePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Pago fallido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
          </p>

          <div className="flex flex-col space-y-2">
            <Button onClick={() => router.push("/cart")}>Volver al carrito</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Volver a la tienda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
