import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

export async function GET(req: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Obtener parámetros de consulta
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Obtener órdenes del usuario
    const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Obtener el total de órdenes para la paginación
    const total = await Order.countDocuments({ user: session.user.id })

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error al obtener órdenes:", error)
    return NextResponse.json({ message: error.message || "Error al obtener órdenes" }, { status: 500 })
  }
}
