"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { session, isLoading } = useAuth({ required: true })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-base">{session?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de cuenta</p>
                  <p className="text-base capitalize">{session?.user?.role}</p>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => signOut({ callbackUrl: "/" })}>
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Direcciones de Envío</CardTitle>
              <CardDescription>Gestiona tus direcciones de envío</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">No tienes direcciones de envío guardadas.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Añadir Dirección</Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>Revisa tus pedidos anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No tienes pedidos anteriores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
