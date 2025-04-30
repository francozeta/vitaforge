"use client"

import type React from "react"

import { useState } from "react"
import { updateUserProfile } from "@/app/(main)/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface EditProfileFormProps {
  initialName: string
}

export function EditProfileForm({ initialName }: EditProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)

    try {
      const result = await updateUserProfile(formData)

      if (result.success) {
        toast.success(result.message)
        setIsEditing(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">Nombre</p>
          <p className="text-base">{initialName}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-xs">
          Editar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nombre
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-base"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setIsEditing(false)
            setName(initialName)
          }}
          disabled={isSubmitting}
          className="text-xs"
        >
          Cancelar
        </Button>
        <Button type="submit" size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-xs" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
