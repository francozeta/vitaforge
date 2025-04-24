"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Trash2, Upload, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category {
  _id: string
  name: string
}

interface ProductImage {
  url: string
  path: string
  alt?: string
}

interface NutritionalInfo {
  servingSize: string
  servingsPerContainer: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  additionalInfo?: Record<string, string>
}

interface ProductFormProps {
  initialData?: {
    _id?: string
    name: string
    description: string
    shortDescription: string
    price: number
    compareAtPrice?: number
    stock: number
    sku: string
    images: ProductImage[]
    category: string
    tags: string[]
    ingredients: string[]
    nutritionalInfo: NutritionalInfo
    featured: boolean
    isActive: boolean
  }
  categories: Category[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    sku: "",
    images: [] as ProductImage[],
    category: "",
    tags: [] as string[],
    ingredients: [] as string[],
    nutritionalInfo: {
      servingSize: "",
      servingsPerContainer: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      additionalInfo: {} as Record<string, string>,
    },
    featured: false,
    isActive: true,
  })

  // Estado para manejar tags e ingredientes
  const [tagInput, setTagInput] = useState("")
  const [ingredientInput, setIngredientInput] = useState("")

  // Estado para manejar información nutricional adicional
  const [additionalInfoKey, setAdditionalInfoKey] = useState("")
  const [additionalInfoValue, setAdditionalInfoValue] = useState("")

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: Number.parseFloat(value) || 0,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseFloat(value) || 0,
      }))
    }
  }

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambios en switches
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Agregar tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  // Eliminar tag
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // Agregar ingrediente
  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }))
      setIngredientInput("")
    }
  }

  // Eliminar ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ingredient),
    }))
  }

  // Agregar información nutricional adicional
  const handleAddAdditionalInfo = () => {
    if (additionalInfoKey.trim() && additionalInfoValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          additionalInfo: {
            ...prev.nutritionalInfo.additionalInfo,
            [additionalInfoKey.trim()]: additionalInfoValue.trim(),
          },
        },
      }))
      setAdditionalInfoKey("")
      setAdditionalInfoValue("")
    }
  }

  // Eliminar información nutricional adicional
  const handleRemoveAdditionalInfo = (key: string) => {
    const newAdditionalInfo = { ...formData.nutritionalInfo.additionalInfo }
    delete newAdditionalInfo[key]

    setFormData((prev) => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        additionalInfo: newAdditionalInfo,
      },
    }))
  }

  // Manejar subida de imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP")
      return
    }

    // Validar tamaño de archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. El tamaño máximo es 5MB")
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("productId", initialData?._id || "new")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al subir la imagen")
      }

      const result = await response.json()

      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: result.url,
            path: result.path,
            alt: prev.name,
          },
        ],
      }))

      toast.success("Imagen subida exitosamente")
    } catch (error: any) {
      toast.error(error.message || "Error al subir la imagen")
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Eliminar imagen
  const handleRemoveImage = (path: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.path !== path),
    }))
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    const requiredFields = [
      "name",
      "description",
      "shortDescription",
      "price",
      "sku",
      "category",
      "nutritionalInfo.servingSize",
      "nutritionalInfo.servingsPerContainer",
    ]

    for (const field of requiredFields) {
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        if (!formData[parent as keyof typeof formData][child]) {
          toast.error(`El campo ${child} es requerido`)
          return
        }
      } else if (!formData[field as keyof typeof formData]) {
        toast.error(`El campo ${field} es requerido`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const url = initialData?._id ? `/api/admin/products/${initialData._id}` : "/api/admin/products"

      const method = initialData?._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Error al ${initialData?._id ? "actualizar" : "crear"} el producto`)
      }

      toast.success(`Producto ${initialData?._id ? "actualizado" : "creado"} exitosamente`)
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || `Error al ${initialData?._id ? "actualizar" : "crear"} el producto`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="nutrition">Información Nutricional</TabsTrigger>
        </TabsList>

        {/* Pestaña General */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Descripción Corta *</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Completa *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (€) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Precio Comparativo (€)</Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
            />
            <Label htmlFor="featured">Destacado</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Activo</Label>
          </div>
        </TabsContent>

        {/* Pestaña Imágenes */}
        <TabsContent value="images" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Label htmlFor="image" className="mr-4">
                Subir Imagen
              </Label>
              <input
                id="image"
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? "Subiendo..." : "Seleccionar Archivo"}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <Card key={index}>
                  <CardContent className="p-2">
                    <div className="relative aspect-square">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt || "Imagen del producto"}
                        fill
                        className="object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(image.path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pestaña Detalles */}
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-4">
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Añadir etiqueta"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Ingredientes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                  {ingredient}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                placeholder="Añadir ingrediente"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient())}
              />
              <Button type="button" onClick={handleAddIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Pestaña Información Nutricional */}
        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.servingSize">Tamaño de Porción *</Label>
              <Input
                id="nutritionalInfo.servingSize"
                name="nutritionalInfo.servingSize"
                value={formData.nutritionalInfo.servingSize}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.servingsPerContainer">Porciones por Envase *</Label>
              <Input
                id="nutritionalInfo.servingsPerContainer"
                name="nutritionalInfo.servingsPerContainer"
                type="number"
                min="1"
                value={formData.nutritionalInfo.servingsPerContainer}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.calories">Calorías</Label>
              <Input
                id="nutritionalInfo.calories"
                name="nutritionalInfo.calories"
                type="number"
                min="0"
                value={formData.nutritionalInfo.calories}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.protein">Proteínas (g)</Label>
              <Input
                id="nutritionalInfo.protein"
                name="nutritionalInfo.protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.protein}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.carbs">Carbohidratos (g)</Label>
              <Input
                id="nutritionalInfo.carbs"
                name="nutritionalInfo.carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.carbs}
                onChange={handleNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo.fat">Grasas (g)</Label>
              <Input
                id="nutritionalInfo.fat"
                name="nutritionalInfo.fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.fat}
                onChange={handleNumberChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Información Nutricional Adicional</Label>
            <div className="space-y-2">
              {Object.entries(formData.nutritionalInfo.additionalInfo || {}).map(([key, value], index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <div>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveAdditionalInfo(key)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={additionalInfoKey}
                onChange={(e) => setAdditionalInfoKey(e.target.value)}
                placeholder="Nombre (ej: Vitamina C)"
              />
              <Input
                value={additionalInfoValue}
                onChange={(e) => setAdditionalInfoValue(e.target.value)}
                placeholder="Valor (ej: 80mg)"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAddAdditionalInfo}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Información
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialData?._id ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </div>
    </form>
  )
}
