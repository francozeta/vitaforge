import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import { createPaymentPreference } from "@/lib/mercadopago"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { items, shippingAddress, totalAmount } = await req.json()

    // Validar datos
    if (!items || !items.length || !shippingAddress || !totalAmount) {
      return NextResponse.json({ message: "Datos incompletos para crear el pedido" }, { status: 400 })
    }

    console.log("Creando orden con los siguientes datos:", {
      userId: session.user.id,
      items: items.length,
      shippingAddress,
      totalAmount,
    })

    // Crear orden en la base de datos
    const order = await Order.create({
      user: session.user.id,
      items,
      shippingAddress,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    })

    console.log("Orden creada con ID:", order._id)

    // Crear preferencia de pago en Mercado Pago
    // Asegurarnos de que _id existe y convertirlo a string de forma segura
    const orderId = order._id ? order._id.toString() : undefined
    const preference = await createPaymentPreference(items, session.user.id, orderId)

    console.log("Preferencia de pago creada:", {
      preferenceId: preference.id,
      initPoint: preference.init_point,
    })

    return NextResponse.json({
      success: true,
      orderId: orderId,
      preferenceId: preference.id,
      initPoint: preference.init_point,
    })
  } catch (error: any) {
    console.error("Error al procesar checkout:", error)
    return NextResponse.json({ message: error.message || "Error al procesar el checkout" }, { status: 500 })
  }
}
