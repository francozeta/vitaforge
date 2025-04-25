import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Obtener parámetros de consulta
    const searchParams = req.nextUrl.searchParams
    const onlyActive = searchParams.get("active") === "true"

    // Construir filtro
    const filter: any = {}
    if (onlyActive) filter.isActive = true

    const categories = await Category.find(filter).sort({ name: 1 })

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ message: error.message || "Error al obtener categorías" }, { status: 500 })
  }
}
