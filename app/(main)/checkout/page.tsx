/* "use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    phone: "",
  })
  const router = useRouter()
  const { data: session } = useSession()

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar formulario
      const requiredFields = ["name", "address", "city", "postalCode", "province", "phone"]
      for (const field of requiredFields) {
        if (!shippingAddress[field as keyof typeof shippingAddress]) {
          toast.error(`El campo ${field} es requerido`)
          setIsLoading(false)
          return
        }
      }

      // Verificar si el usuario está autenticado
      if (!session?.user) {
        toast.error("Debes iniciar sesión para continuar")
        router.push("/auth/login?callbackUrl=/checkout")
        return
      }

      // Enviar datos al servidor
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          totalAmount: total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pago")
      }

      // Redirigir a Mercado Pago
      if (data.initPoint) {
        // Guardar el ID de la orden en localStorage para recuperarlo después
        localStorage.setItem("currentOrderId", data.orderId)
        // Limpiar el carrito antes de redirigir
        clearCart()
        // Redirigir a la página de pago de Mercado Pago
        window.location.href = data.initPoint
      } else {
        throw new Error("No se pudo obtener el enlace de pago")
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al procesar el pago")
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="border rounded-md p-2"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Dirección
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="border rounded-md p-2"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        Ciudad
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        className="border rounded-md p-2"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="postalCode" className="text-sm font-medium">
                        Código Postal
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        className="border rounded-md p-2"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="province" className="text-sm font-medium">
                      Provincia
                    </label>
                    <input
                      id="province"
                      name="province"
                      type="text"
                      className="border rounded-md p-2"
                      value={shippingAddress.province}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="border rounded-md p-2"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Proceder al pago"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
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
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right font-medium text-sm">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
 */
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    phone: "",
  })
  const router = useRouter()
  const { data: session } = useSession()

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar formulario
      const requiredFields = ["name", "address", "city", "postalCode", "province", "phone"]
      for (const field of requiredFields) {
        if (!shippingAddress[field as keyof typeof shippingAddress]) {
          toast.error(`El campo ${field} es requerido`)
          setIsLoading(false)
          return
        }
      }

      // Verificar si el usuario está autenticado
      if (!session?.user) {
        toast.error("Debes iniciar sesión para continuar")
        router.push("/auth/login?callbackUrl=/checkout")
        return
      }

      console.log("Enviando datos al servidor:", {
        items: items.length,
        shippingAddress,
        totalAmount: total,
      })

      // Enviar datos al servidor
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          totalAmount: total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pago")
      }

      console.log("Respuesta del servidor:", data)

      // Redirigir a Mercado Pago
      if (data.initPoint) {
        // Guardar el ID de la orden en localStorage para recuperarlo después
        localStorage.setItem("currentOrderId", data.orderId)
        // Limpiar el carrito antes de redirigir
        clearCart()
        // Redirigir a la página de pago de Mercado Pago
        window.location.href = data.initPoint
      } else {
        throw new Error("No se pudo obtener el enlace de pago")
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al procesar el pago")
      setIsLoading(false)
    }
  }

  // Resto del componente...
}
