"use client"

import { useState, useEffect } from "react"
import { getUserData } from "@/app/(main)/actions/user-actions"

import { Skeleton } from "@/components/ui/skeleton"
import { AddressForm } from "./address-form"
import { AddressCard } from "./address-card"

export function AddressList() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAddresses = async () => {
    setIsLoading(true)
    try {
      const userData = await getUserData()
      if (userData) {
        setAddresses(userData.shippingAddresses || [])
      }
    } catch (error) {
      console.error("Error al cargar direcciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <Skeleton className="h-[150px] w-full rounded-lg" />
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 mb-4">No tienes direcciones de envío guardadas.</p>
        <AddressForm
          buttonText="Añadir Dirección"
          onSuccess={loadAddresses}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onDeleted={loadAddresses} />
        ))}
      </div>
      <div className="mt-4">
        <AddressForm
          buttonText="Añadir Nueva Dirección"
          onSuccess={loadAddresses}
        />
      </div>
    </div>
  )
}
