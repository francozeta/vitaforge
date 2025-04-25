"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Tu Carrito</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
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
                  <span className="text-right">Calculado en el checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-sm md:text-base">Proceder al pago</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
