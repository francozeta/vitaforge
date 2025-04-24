import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"
import ProductForm from "@/components/admin/product-form"

export default async function CreateProductPage() {
  // Verificar si el usuario está autenticado y es administrador
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  // Obtener categorías
  await dbConnect()
  const categories = await Category.find({ isActive: true }).sort({ name: 1 })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>

      <ProductForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  )
}
