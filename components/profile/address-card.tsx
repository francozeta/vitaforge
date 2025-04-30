"use client"

import { useState } from "react"
import { deleteShippingAddress } from "@/app/(main)/actions/user-actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AddressForm } from "./address-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Home } from "lucide-react"

interface AddressCardProps {
  address: {
    id: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    isDefault: boolean
  }
  onDeleted?: () => void
}

export function AddressCard({ address, onDeleted }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    const formData = new FormData()
    formData.append("addressId", address.id)

    try {
      const result = await deleteShippingAddress(formData)

      if (result.success) {
        toast.success(result.message)
        onDeleted?.()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Error al eliminar la dirección")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 relative">
      {address.isDefault && (
        <Badge className="absolute top-2 right-2 bg-neutral-900 rounded-full ">
          <span className="hidden lg:inline">Predeterminada</span>
          <Home className="text-2xl lg:hidden" />
        </Badge>
      )}

      <div className="space-y-2 mb-4">
        <p className="font-medium">{address.street}</p>
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
        <p className="text-sm text-gray-600">Tel: {address.phone}</p>
      </div>

      <div className="flex gap-2">
        <AddressForm
          address={address}
          buttonText="Editar"
          buttonVariant="outline"
          buttonSize="sm"
          onSuccess={onDeleted}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 text-xs"
            >
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente esta dirección de envío.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
