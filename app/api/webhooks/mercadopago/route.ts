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

    // Verificar si es una notificación de pago
    if (body.action === "payment.created" || body.action === "payment.updated") {
      const paymentId = body.data.id

      // Verificar el pago con Mercado Pago
      const payment = await verifyPayment(paymentId)

      // Obtener el ID del usuario desde los metadatos
      const userId = payment.metadata?.userId

      if (!userId) {
        console.error("No se encontró el ID del usuario en los metadatos")
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 200 })
      }

      // Buscar el usuario en la base de datos
      const user = await User.findById(userId)

      if (!user) {
        console.error(`Usuario no encontrado: ${userId}`)
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 200 })
      }

      // Si el pago está aprobado, crear una orden
      if (payment.status === "approved") {
        // Obtener los items del pago
        const items =
          payment.additional_info?.items?.map((item: any) => ({
            _id: item.id,
            name: item.title,
            price: item.unit_price,
            quantity: item.quantity,
            image: item.picture_url,
          })) || []

        // Obtener la dirección de envío predeterminada del usuario
        const defaultAddress = user.shippingAddresses.find((addr) => addr.isDefault) || user.shippingAddresses[0]

        if (!defaultAddress) {
          console.error("El usuario no tiene dirección de envío")
          return NextResponse.json({ message: "Dirección de envío no encontrada" }, { status: 200 })
        }

        // Crear la orden
        await Order.create({
          user: userId,
          items,
          shippingAddress: {
            name: user.name,
            address: defaultAddress.street,
            city: defaultAddress.city,
            province: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            phone: "", // Aquí podrías agregar un campo de teléfono al modelo de usuario si lo necesitas
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
