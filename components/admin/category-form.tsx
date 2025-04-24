"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface CategoryFormProps {
  onSuccess: () => void
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es requerido")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear la categoría")
      }

      toast.success("Categoría creada exitosamente")
      setFormData({
        name: "",
        description: "",
        isActive: true,
      })
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Error al crear la categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Categoría *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="isActive">Activa</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Crear Categoría"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
