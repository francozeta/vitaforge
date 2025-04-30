import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

export async function GET(req: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Obtener parámetros de consulta
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const status = url.searchParams.get("status") || undefined
    const skip = (page - 1) * limit

    // Construir la consulta
    const query: any = {}
    if (status) {
      query.status = status
    }

    // Obtener órdenes
    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Obtener el total de órdenes para la paginación
    const total = await Order.countDocuments(query)

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
