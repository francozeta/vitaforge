import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createPaymentPreference } from "@/lib/mercadopago"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { items } = await req.json()

    // Validar datos
    if (!items || !items.length) {
      return NextResponse.json({ message: "No hay productos en el carrito" }, { status: 400 })
    }

    // Crear preferencia de pago en Mercado Pago
    const preference = await createPaymentPreference(items, session.user.id)

    return NextResponse.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
    })
  } catch (error: any) {
    console.error("Error al crear preferencia de pago:", error)
    return NextResponse.json({ message: error.message || "Error al crear preferencia de pago" }, { status: 500 })
  }
}
