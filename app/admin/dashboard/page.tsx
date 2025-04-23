import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de Administración | VitaForge",
  description: "Panel de administración para gestionar productos, pedidos y usuarios.",
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="text-lg">Bienvenido al panel de administración de VitaForge.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Productos</h2>
          <p className="text-gray-600">Gestiona el catálogo de productos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pedidos</h2>
          <p className="text-gray-600">Administra los pedidos de clientes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
          <p className="text-gray-600">Gestiona las cuentas de usuario</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Promociones</h2>
          <p className="text-gray-600">Crea y administra promociones</p>
        </div>
      </div>
    </div>
  )
}
