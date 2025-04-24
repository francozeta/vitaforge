import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"

// GET - Obtener todos los productos (con paginación y filtros)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    // Obtener parámetros de consulta
    const searchParams = req.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const active = searchParams.get("active")

    // Construir filtro
    const filter: any = {}

    if (category) filter.category = category
    if (search) filter.name = { $regex: search, $options: "i" }
    if (featured) filter.featured = featured === "true"
    if (active) filter.isActive = active === "true"

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
    return NextResponse.json({ message: error.message || "Error al obtener productos" }, { status: 500 })
  }
}

// POST - Crear un nuevo producto
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    const productData = await req.json()

    // Validar datos requeridos
    const requiredFields = ["name", "description", "shortDescription", "price", "sku", "category", "nutritionalInfo"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ message: `El campo ${field} es requerido` }, { status: 400 })
      }
    }

    // Verificar si ya existe un producto con el mismo SKU
    const existingProduct = await Product.findOne({ sku: productData.sku })
    if (existingProduct) {
      return NextResponse.json({ message: "Ya existe un producto con este SKU" }, { status: 400 })
    }

    // Crear el producto
    const product = await Product.create(productData)

    return NextResponse.json({ message: "Producto creado exitosamente", product }, { status: 201 })
  } catch (error: any) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ message: error.message || "Error al crear producto" }, { status: 500 })
  }
}
