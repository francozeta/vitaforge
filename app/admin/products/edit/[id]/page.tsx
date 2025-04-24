import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import Category from "@/models/Category"
import ProductForm from "@/components/admin/product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Verificar si el usuario está autenticado y es administrador
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  // Obtener producto y categorías
  await dbConnect()

  try {
    const [product, categories] = await Promise.all([
      Product.findById(params.id),
      Category.find({ isActive: true }).sort({ name: 1 }),
    ])

    if (!product) {
      notFound()
    }

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>

        <ProductForm
          initialData={JSON.parse(JSON.stringify(product))}
          categories={JSON.parse(JSON.stringify(categories))}
        />
      </div>
    )
  } catch (error) {
    console.error("Error al cargar producto:", error)
    notFound()
  }
}
