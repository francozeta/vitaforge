import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Obtener parámetros de consulta
    const searchParams = req.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const active = searchParams.get("active") || "true" // Por defecto solo productos activos

    // Construir filtro
    const filter: any = {}

    if (category && category !== "all") filter.category = category
    if (search) filter.name = { $regex: search, $options: "i" }
    if (featured === "true") filter.featured = true
    if (featured === "false") filter.featured = false

    // Para la API pública, solo mostrar productos activos por defecto
    if (active === "true") filter.isActive = true
    if (active === "false") filter.isActive = false

    // Calcular skip para paginación
    const skip = (page - 1) * limit

    // Obtener productos y contar total
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ])

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error: any) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json(
      {
        message: error.message || "Error al obtener productos",
      },
      { status: 500 },
    )
  }
}
