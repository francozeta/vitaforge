import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"

// GET - Obtener todas las categorías
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

// POST - Crear una nueva categoría
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    const categoryData = await req.json()

    // Validar datos requeridos
    if (!categoryData.name) {
      return NextResponse.json({ message: "El nombre de la categoría es requerido" }, { status: 400 })
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await Category.findOne({ name: categoryData.name })
    if (existingCategory) {
      return NextResponse.json({ message: "Ya existe una categoría con este nombre" }, { status: 400 })
    }

    // Crear la categoría
    const category = await Category.create(categoryData)

    return NextResponse.json({ message: "Categoría creada exitosamente", category }, { status: 201 })
  } catch (error: any) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ message: error.message || "Error al crear categoría" }, { status: 500 })
  }
}
