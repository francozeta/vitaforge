import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { uploadProductImage } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Verificar si la solicitud es multipart/form-data
    const formData = await req.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string

    if (!file) {
      return NextResponse.json({ message: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ message: "Se requiere el ID del producto" }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP" },
        { status: 400 },
      )
    }

    // Validar tamaño de archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: "El archivo es demasiado grande. El tamaño máximo es 5MB" }, { status: 400 })
    }

    // Subir imagen a Supabase Storage
    const result = await uploadProductImage(file, productId)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ message: error.message || "Error al subir imagen" }, { status: 500 })
  }
}
