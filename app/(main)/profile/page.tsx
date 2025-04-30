"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getUserData } from "@/app/(main)/actions/user-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { EditProfileForm } from "@/components/profile/edit-profile-form"
import { AddressList } from "@/components/profile/address-list"
import { OrderList } from "@/components/profile/order-list"
import { ProfileSkeleton } from "@/components/profile/profile-skeleton"

export default function ProfilePage() {
  const { session, isLoading: authLoading } = useAuth({ required: true })
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          const data = await getUserData()
          setUserData(data)
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (!authLoading && session) {
      loadUserData()
    } else if (!authLoading) {
      setIsLoading(false)
    }
  }, [session, authLoading])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="py-5">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <EditProfileForm initialName={userData?.name || session?.user?.name || ""} />

                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base break-all">{userData?.email || session?.user?.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de cuenta</p>
                  <p className="text-base capitalize">{userData?.role || session?.user?.role || "cliente"}</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 text-sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  size="sm"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="py-5">
            <CardHeader>
              <CardTitle>Direcciones de Envío</CardTitle>
              <CardDescription>Gestiona tus direcciones de envío</CardDescription>
            </CardHeader>
            <CardContent>
              <AddressList />
            </CardContent>
          </Card>

          <Card className="mt-6 py-5">
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>Revisa tus pedidos anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
