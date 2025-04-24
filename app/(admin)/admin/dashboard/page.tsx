import Link from "next/link"
import { Package, ShoppingCart, Users, Tag, FolderTree } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de Administración | VitaForge",
  description: "Panel de administración para gestionar productos, pedidos y usuarios.",
}

export default async function AdminDashboardPage() {
  // Verificar si el usuario está autenticado y es administrador
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="text-lg">Bienvenido al panel de administración de VitaForge.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Productos</h2>
              <p className="text-gray-600">Gestiona el catálogo de productos</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <FolderTree className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Categorías</h2>
              <p className="text-gray-600">Gestiona las categorías de productos</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Pedidos</h2>
              <p className="text-gray-600">Administra los pedidos de clientes</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
              <p className="text-gray-600">Gestiona las cuentas de usuario</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/promotions" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Tag className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Promociones</h2>
              <p className="text-gray-600">Crea y administra promociones</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
