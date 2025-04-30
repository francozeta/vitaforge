import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const orderId = params.id

    // Obtener la orden
    const order = await Order.findById(orderId)

    // Verificar si la orden existe
    if (!order) {
      return NextResponse.json({ message: "Orden no encontrada" }, { status: 404 })
    }

    // Verificar si la orden pertenece al usuario o si el usuario es admin
    if (order.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error al obtener orden:", error)
    return NextResponse.json({ message: error.message || "Error al obtener orden" }, { status: 500 })
  }
}
