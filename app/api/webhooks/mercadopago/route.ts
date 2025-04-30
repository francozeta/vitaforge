import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { verifyPayment } from "@/lib/mercadopago"
import Order from "@/models/Order"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await dbConnect()

    // Obtener datos de la notificación
    const body = await req.json()

    console.log("Webhook de Mercado Pago recibido:", body)

    // Verificar si es una notificación de pago
    if (body.action === "payment.created" || body.action === "payment.updated" || body.type === "payment") {
      // Obtener el ID del pago, que puede venir en diferentes formatos según el tipo de notificación
      const paymentId = body.data?.id || body.resource?.split("/").pop() || body.id

      if (!paymentId) {
        console.error("No se pudo obtener el ID del pago")
        return NextResponse.json({ message: "ID de pago no encontrado" }, { status: 200 })
      }

      console.log("Verificando pago con ID:", paymentId)

      // Verificar el pago con Mercado Pago
      const payment = await verifyPayment(paymentId)

      console.log("Información del pago:", {
        status: payment.status,
        metadata: payment.metadata,
        additional_info: payment.additional_info ? "presente" : "ausente",
      })

      // Obtener el ID del usuario desde los metadatos (puede venir en diferentes formatos)
      // Mercado Pago puede convertir camelCase a snake_case, así que verificamos ambos
      const userId = payment.metadata?.userId || payment.metadata?.user_id

      if (!userId) {
        console.error("No se encontró el ID del usuario en los metadatos")
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 200 })
      }

      // Obtener el ID de la orden desde los metadatos (puede venir en diferentes formatos)
      const orderId = payment.metadata?.orderId || payment.metadata?.order_id

      console.log("IDs extraídos:", { userId, orderId })

      // Buscar el usuario en la base de datos
      const user = await User.findById(userId)

      if (!user) {
        console.error(`Usuario no encontrado: ${userId}`)
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 200 })
      }

      // Si el pago está aprobado
      if (payment.status === "approved") {
        console.log("Pago aprobado, procesando orden")

        // Si tenemos el ID de la orden, actualizamos la orden existente
        if (orderId) {
          const order = await Order.findById(orderId)

          if (order) {
            console.log("Actualizando orden existente:", orderId)
            order.paymentStatus = "paid"
            order.status = "processing"
            order.paymentDetails = {
              method: "mercadopago",
              transactionId: paymentId,
              amount: payment.transaction_amount,
              currency: payment.currency_id,
              paidAt: new Date(),
            }

            await order.save()
            console.log("Orden actualizada con ID:", orderId)
            return NextResponse.json({ success: true }, { status: 200 })
          } else {
            console.log("Orden no encontrada con ID:", orderId)
          }
        }

        // Si no tenemos el ID de la orden o no se encontró, creamos una nueva
        console.log("Creando nueva orden para el usuario:", userId)

        // Obtener los items del pago
        let items = []

        if (payment.additional_info?.items) {
          items = payment.additional_info.items.map((item: any) => ({
            _id: item.id,
            name: item.title,
            price: item.unit_price,
            quantity: item.quantity,
            image: item.picture_url,
          }))
        } else {
          // Si no hay items en additional_info, crear un item genérico
          console.log("No se encontraron items en additional_info, creando item genérico")
          items = [
            {
              _id: "generic-item",
              name: "Compra en VitaForge",
              price: payment.transaction_amount,
              quantity: 1,
              image: "",
            },
          ]
        }

        // Obtener la dirección de envío predeterminada del usuario
        const defaultAddress = user.shippingAddresses.find((addr) => addr.isDefault) || user.shippingAddresses[0]

        if (!defaultAddress) {
          console.error("El usuario no tiene dirección de envío")
          return NextResponse.json({ message: "Dirección de envío no encontrada" }, { status: 200 })
        }

        // Crear la orden
        const newOrder = await Order.create({
          user: userId,
          items,
          shippingAddress: {
            name: user.name,
            address: defaultAddress.street,
            city: defaultAddress.city,
            province: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            phone: defaultAddress.phone || "", // Usar el teléfono de la dirección si existe
          },
          totalAmount: payment.transaction_amount,
          status: "processing",
          paymentStatus: "paid",
          paymentDetails: {
            method: "mercadopago",
            transactionId: paymentId,
            amount: payment.transaction_amount,
            currency: payment.currency_id,
            paidAt: new Date(),
          },
        })

        console.log("Nueva orden creada con ID:", newOrder._id)
      }
    }

    // Siempre responder con 200 para confirmar recepción
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error en webhook de Mercado Pago:", error)
    // Aún así respondemos con 200 para evitar reintentos
    return NextResponse.json({ success: false, error: error.message }, { status: 200 })
  }
}
