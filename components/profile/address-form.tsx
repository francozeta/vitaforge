"use client"

import type React from "react"

import { useState } from "react"
import { addShippingAddress, updateShippingAddress } from "@/app/(main)/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

interface AddressFormProps {
  address?: {
    id: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    isDefault: boolean
  }
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  onSuccess?: () => void
}

export function AddressForm({
  address,
  buttonText = "Añadir Dirección",
  buttonVariant = "default",
  buttonSize = "default",
  onSuccess,
}: AddressFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "Perú",
    phone: address?.phone || "",
    isDefault: address?.isDefault || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData()

    if (address?.id) {
      form.append("addressId", address.id)
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) form.append(key, "on")
      } else {
        form.append(key, value)
      }
    })

    try {
      const result = address?.id ? await updateShippingAddress(form) : await addShippingAddress(form)

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        onSuccess?.()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Error al procesar la dirección")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={`${buttonVariant === "default" ? "bg-neutral-900 hover:bg-neutral-800" : ""} text-xs`}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{address ? "Editar Dirección" : "Añadir Nueva Dirección"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm">
                Dirección
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Calle, número, piso..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm">
                  Ciudad
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm">
                  Provincia
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Provincia"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm">
                  Código Postal
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Código Postal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm">
                  País
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="País"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked === true }))}
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                Establecer como dirección predeterminada
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} size="sm">
              Cancelar
            </Button>
            <Button type="submit" className="bg-neutral-900 hover:bg-neutral-800" disabled={isSubmitting} size="sm">
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
