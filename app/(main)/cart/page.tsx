"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getUserData } from "@/app/(main)/actions/user-actions"

// Interfaz para la dirección de envío
interface ShippingAddress {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const { data: session, status } = useSession()
  const [defaultAddress, setDefaultAddress] = useState<ShippingAddress | null>(null)

  // Cargar la dirección predeterminada del usuario
  useEffect(() => {
    const loadDefaultAddress = async () => {
      if (status === "authenticated") {
        setIsLoadingAddress(true)
        try {
          const userData = await getUserData()
          if (userData && userData.shippingAddresses && userData.shippingAddresses.length > 0) {
            // Buscar la dirección predeterminada
            const defaultAddr =
              userData.shippingAddresses.find((addr) => addr.isDefault) || userData.shippingAddresses[0]
            setDefaultAddress(defaultAddr)
          }
        } catch (error) {
          console.error("Error al cargar la dirección predeterminada:", error)
        } finally {
          setIsLoadingAddress(false)
        }
      }
    }

    loadDefaultAddress()
  }, [status])

  // Función para proceder al pago directamente
  const handleCheckout = async () => {
    // Verificar si el usuario está autenticado
    if (status !== "authenticated") {
      toast.error("Debes iniciar sesión para continuar")
      return
    }

    // Verificar si el usuario tiene una dirección predeterminada
    if (!defaultAddress) {
      toast.error("Necesitas añadir una dirección de envío antes de continuar")
      // Redirigir al usuario a la página de perfil para añadir una dirección
      window.location.href = "/profile"
      return
    }

    setIsLoading(true)

    try {
      // Crear preferencia de pago con la dirección predeterminada
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress: {
            name: session.user.name || "",
            address: defaultAddress.street,
            city: defaultAddress.city,
            province: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            phone: defaultAddress.phone || "",
          },
          totalAmount: total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pago")
      }

      // Redirigir a Mercado Pago
      if (data.initPoint) {
        // Guardar el orderId en localStorage si existe
        if (data.orderId) {
          /* console.log("Guardando orderId en localStorage:", data.orderId) */
          localStorage.setItem("currentOrderId", data.orderId)
        } else {
         /*  console.warn("No se recibió orderId del servidor") */
        }

        // Limpiar el carrito antes de redirigir
        clearCart()

        // Redirigir a la página de pago de Mercado Pago
        window.location.href = data.initPoint
      } else {
        throw new Error("No se pudo obtener el enlace de pago")
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al procesar el pago")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Tu Carrito</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-12 w-12 ext-neutral-900" />
              <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
              <p className="text-muted-foreground">Parece que aún no has añadido productos a tu carrito.</p>
              <Button asChild className="mt-4">
                <Link href="/products">Ver Productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Tu Carrito</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="py-8 gap-0">
            <CardHeader className="pb-1">
              <CardTitle className="text-lg md:text-xl">Productos ({itemCount})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item._id} className="p-3 md:p-4">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      {/* Imagen del producto */}
                      <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={item.image || "/placeholder.svg?height=80&width=80&query=product"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${item._id}`}
                            className="font-medium hover:underline text-sm md:text-base line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <div className="text-right font-medium text-sm md:text-base hidden sm:block">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          Precio unitario: {formatCurrency(item.price)}
                        </p>

                        {/* Precio total en móvil */}
                        <div className="text-right font-medium text-sm md:text-base mt-2 sm:hidden">
                          {formatCurrency(item.price * item.quantity)}
                        </div>

                        {/* Controles de cantidad y botón eliminar */}
                        <div className="flex items-center justify-between mt-3 sm:mt-4">
                          <div className="scale-90 origin-left md:scale-100">
                            <QuantitySelector
                              defaultValue={item.quantity}
                              onChange={(value) => updateQuantity(item._id, value)}
                            />
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-8 px-2 md:px-3"
                            onClick={() => removeItem(item._id)}
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            <span className="text-xs md:text-sm">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-10" asChild>
                <Link href="/products" className="flex items-center">
                  <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Seguir comprando
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="py-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-right">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Mostrar información de la dirección de envío si está disponible */}
              {defaultAddress && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-4 w-4" />
                    <p className="font-medium">Dirección de envío:</p>
                  </div>
                  <p className="text-sm">{defaultAddress.street}</p>
                  <p className="text-sm">
                    {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                  </p>
                  <p className="text-sm">{defaultAddress.country}</p>
                  {defaultAddress.phone && <p className="text-sm">Tel: {defaultAddress.phone}</p>}
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link href="/profile">Cambiar dirección</Link>
                  </Button>
                </div>
              )}

              {/* Mostrar mensaje si no hay dirección */}
              {status === "authenticated" && !defaultAddress && !isLoadingAddress && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1 mb-2 text-amber-600">
                    <MapPin className="h-4 w-4" />
                    <p className="font-medium">No tienes dirección de envío</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Necesitas añadir una dirección de envío antes de continuar con la compra.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/profile">Añadir dirección</Link>
                  </Button>
                </div>
              )}

              {/* Mostrar cargando si está obteniendo la dirección */}
              {isLoadingAddress && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Cargando dirección de envío...</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-sm md:text-base"
                onClick={handleCheckout}
                disabled={isLoading || !defaultAddress || status !== "authenticated"}
              >
                {isLoading ? "Procesando..." : "Proceder al pago"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
