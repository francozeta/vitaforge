import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
    const sort = searchParams.get("sort") || "-createdAt" // Por defecto ordenar por más recientes

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
      Product.find(filter).sort(sort).skip(skip).limit(limit),
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    // Obtener datos del producto del cuerpo de la solicitud
    const productData = await req.json()

    // Crear nuevo producto
    const product = new Product(productData)
    await product.save()

    return NextResponse.json({
      message: "Producto creado exitosamente",
      product,
    })
  } catch (error: any) {
    console.error("Error al crear producto:", error)
    return NextResponse.json(
      {
        message: error.message || "Error al crear producto",
      },
      { status: 500 },
    )
  }
}
