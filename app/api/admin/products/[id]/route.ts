import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import { deleteProductImage } from "@/lib/supabase"

// GET - Obtener un producto por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ message: error.message || "Error al obtener producto" }, { status: 500 })
  }
}

// PUT - Actualizar un producto
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    const productData = await req.json()

    // Verificar si el producto existe
    const existingProduct = await Product.findById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    // Verificar si el SKU ya está en uso por otro producto
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ sku: productData.sku, _id: { $ne: params.id } })
      if (skuExists) {
        return NextResponse.json({ message: "Ya existe un producto con este SKU" }, { status: 400 })
      }
    }

    // Actualizar el producto
    const updatedProduct = await Product.findByIdAndUpdate(params.id, productData, { new: true, runValidators: true })

    return NextResponse.json({ message: "Producto actualizado exitosamente", product: updatedProduct })
  } catch (error: any) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ message: error.message || "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE - Eliminar un producto
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario es administrador
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    await dbConnect()

    // Verificar si el producto existe
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    // Eliminar imágenes de Supabase Storage
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.path) {
          try {
            await deleteProductImage(image.path)
          } catch (error) {
            console.error("Error al eliminar imagen:", error)
            // Continuar con la eliminación del producto incluso si falla la eliminación de imágenes
          }
        }
      }
    }

    // Eliminar el producto
    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Producto eliminado exitosamente" })
  } catch (error: any) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ message: error.message || "Error al eliminar producto" }, { status: 500 })
  }
}
