"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import CategoryForm from "@/components/admin/category-form"

interface Category {
  _id: string
  name: string
  description?: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/categories")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      toast.error("Error al cargar categorías. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>Añade una nueva categoría para tus productos.</DialogDescription>
            </DialogHeader>
            <CategoryForm
              onSuccess={() => {
                loadCategories()
                setDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando categorías...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No hay categorías disponibles.</p>
          <p className="text-sm">Crea una nueva categoría para comenzar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable columns={columns} data={categories} />
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
