import { MercadoPagoConfig, Preference } from "mercadopago"
import type { CartItem } from "@/context/cart-context"

// Configuración de Mercado Pago
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

// Función para crear una preferencia de pago
export async function createPaymentPreference(items: CartItem[], userId: string, orderId?: string) {
  try {
    console.log("Creando preferencia de pago con:", {
      items: items.length,
      userId,
      orderId: orderId || "no disponible",
    })

    // Convertir los items del carrito al formato esperado por Mercado Pago
    const mpItems = items.map((item) => ({
      id: item._id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "PEN", // Moneda peruana (soles)
      description: `${item.name}`,
      picture_url: item.image || "",
    }))

    // Crear la preferencia
    const preference = await new Preference(mercadopago).create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        metadata: {
          userId: userId,
          ...(orderId && { orderId: orderId }),
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      },
    })

    console.log("Preferencia creada:", {
      id: preference.id,
      init_point: preference.init_point?.substring(0, 50) + "...",
    })

    return preference
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error)
    throw new Error("No se pudo crear la preferencia de pago")
  }
}

// Función para verificar un pago
export async function verifyPayment(paymentId: string) {
  try {
    console.log("Verificando pago:", paymentId)
    const { Payment } = await import("mercadopago")
    const payment = await new Payment(mercadopago).get({ id: paymentId })

    console.log("Pago verificado:", {
      status: payment.status,
      transaction_amount: payment.transaction_amount,
      metadata: payment.metadata,
    })

    return payment
  } catch (error) {
    console.error("Error al verificar pago:", error)
    throw new Error("No se pudo verificar el pago")
  }
}
