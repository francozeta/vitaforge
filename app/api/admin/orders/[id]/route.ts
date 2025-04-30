import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const orderId = params.id

    // Obtener la orden
    const order = await Order.findById(orderId).populate("user", "name email")

    // Verificar si la orden existe
    if (!order) {
      return NextResponse.json({ message: "Orden no encontrada" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error al obtener orden:", error)
    return NextResponse.json({ message: error.message || "Error al obtener orden" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const orderId = params.id
    const { status, paymentStatus } = await req.json()

    // Verificar datos
    if (!status && !paymentStatus) {
      return NextResponse.json({ message: "No hay datos para actualizar" }, { status: 400 })
    }

    // Construir objeto de actualización
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    // Actualizar la orden
    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })

    // Verificar si la orden existe
    if (!order) {
      return NextResponse.json({ message: "Orden no encontrada" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error al actualizar orden:", error)
    return NextResponse.json({ message: error.message || "Error al actualizar orden" }, { status: 500 })
  }
}
