"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Trash2, Upload, Plus, X, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSKU } from "@/lib/utils"

interface Category {
  _id: string
  name: string
}

interface ProductImage {
  url: string
  path?: string
  file?: File
  alt?: string
  isNew?: boolean
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

interface ProductFormData {
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

interface ProductFormProps {
  initialData?: ProductFormData
  categories: Category[]
}

  export default function  ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState<ProductFormData>({
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

      // Corregido: Usar un enfoque más seguro para actualizar objetos anidados
      if (parent === "nutritionalInfo") {
        setFormData((prev) => ({
          ...prev,
          nutritionalInfo: {
            ...prev.nutritionalInfo,
            [child]: value,
          },
        }))
      }
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

      // Corregido: Usar un enfoque más seguro para actualizar objetos anidados
      if (parent === "nutritionalInfo") {
        setFormData((prev) => ({
          ...prev,
          nutritionalInfo: {
            ...prev.nutritionalInfo,
            [child]: Number.parseFloat(value) || 0,
          },
        }))
      }
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

  // Generar SKU automáticamente
  const handleGenerateSKU = () => {
    const selectedCategory = categories.find((c) => c._id === formData.category)
    const categoryPrefix = selectedCategory ? selectedCategory.name.substring(0, 3).toUpperCase() : "SUP"

    const newSKU = generateSKU(categoryPrefix, formData.name)

    setFormData((prev) => ({
      ...prev,
      sku: newSKU,
    }))

    toast.success("SKU generado automáticamente")
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
    const newAdditionalInfo = { ...formData.nutritionalInfo.additionalInfo } as Record<string, string>
    delete newAdditionalInfo[key]

    setFormData((prev) => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        additionalInfo: newAdditionalInfo,
      },
    }))
  }

  // Manejar selección de múltiples imágenes
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)

    // Validar cada archivo
    for (const file of files) {
      // Validar tipo de archivo
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error(`Tipo de archivo no válido: ${file.name}. Solo se permiten JPEG, PNG y WebP`)
        continue
      }

      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error(`El archivo ${file.name} es demasiado grande. El tamaño máximo es 5MB`)
        continue
      }

      // Crear URL temporal para vista previa
      const imageUrl = URL.createObjectURL(file)

      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: imageUrl,
            file: file,
            alt: prev.name || "Imagen de producto",
            isNew: true,
          },
        ],
      }))
    }

    // Limpiar input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images]

    // Si la imagen tiene una URL temporal creada con URL.createObjectURL, la revocamos
    if (newImages[index].isNew && newImages[index].url) {
      URL.revokeObjectURL(newImages[index].url)
    }

    newImages.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  // Subir imágenes a Supabase
  const uploadImages = async (productId: string) => {
    const newImages = []
    const existingImages = formData.images.filter((img) => !img.isNew)

    // Subir solo las imágenes nuevas
    for (const image of formData.images) {
      if (image.isNew && image.file) {
        const formDataObj = new FormData()
        formDataObj.append("file", image.file)
        formDataObj.append("productId", productId)

        try {
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formDataObj,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Error al subir la imagen")
          }

          const result = await response.json()
          newImages.push({
            url: result.url,
            path: result.path,
            alt: image.alt,
          })
        } catch (error: any) {
          toast.error(`Error al subir imagen: ${error.message}`)
          // Continuamos con las demás imágenes incluso si una falla
        }
      }
    }

    // Combinar imágenes existentes con las nuevas
    return [...existingImages, ...newImages]
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
        const parentObj = formData[parent as keyof typeof formData] as any
        if (!parentObj[child]) {
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
      // Si es un producto nuevo, primero lo creamos para obtener el ID
      let productId = formData._id
      let productData = { ...formData }

      // Eliminar las imágenes del objeto de datos para la creación inicial
      if (!productId) {
        // Guardar temporalmente las imágenes
        const tempImages = [...productData.images]

        // Crear una copia del objeto sin las imágenes
        const productDataWithoutImages = {
          ...productData,
          images: [], // Array vacío para la creación inicial
        }

        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productDataWithoutImages),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Error al crear el producto")
        }

        const result = await response.json()
        productId = result.product._id

        console.log("Producto creado con ID:", productId)

        // Ahora subimos las imágenes si hay alguna
        if (tempImages.length > 0) {
          console.log("Subiendo imágenes para el producto:", productId)
          const uploadedImages = await uploadImages(productId)

          // Actualizar el producto con las imágenes subidas
          if (uploadedImages.length > 0) {
            console.log("Imágenes subidas:", uploadedImages)

            const updateResponse = await fetch(`/api/admin/products/${productId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                images: uploadedImages,
              }),
            })

            if (!updateResponse.ok) {
              const updateError = await updateResponse.json()
              console.error("Error al actualizar producto con imágenes:", updateError)
              toast.error("Las imágenes se subieron pero no se pudieron asociar al producto")
            }
          }
        }
      } else {
        // Es una actualización de un producto existente

        // Primero subimos las imágenes nuevas si hay
        if (productData.images.some((img) => img.isNew)) {
          const uploadedImages = await uploadImages(productId)
          productData = {
            ...productData,
            images: uploadedImages,
          }
        }

        // Actualizamos el producto con todos los datos
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Error al actualizar el producto")
        }
      }

      toast.success(`Producto ${formData._id ? "actualizado" : "creado"} exitosamente`)
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || `Error al ${formData._id ? "actualizar" : "crear"} el producto`)
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
              <div className="flex gap-2">
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                <Button type="button" variant="outline" onClick={handleGenerateSKU}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generar
                </Button>
              </div>
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
              <Label htmlFor="price">Precio (PEN) *</Label>
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
              <Label htmlFor="compareAtPrice">Precio Comparativo (PEN)</Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.compareAtPrice || ""}
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
        <TabsContent value="images" className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg border border-dashed border-muted-foreground/50">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Imágenes del producto</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sube imágenes de tu producto. La primera imagen será la portada.
                </p>
              </div>

              <input
                id="image"
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                multiple
              />

              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mx-auto">
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar imágenes
              </Button>

              <p className="text-xs text-muted-foreground">
                Formatos permitidos: JPEG, PNG, WebP. Tamaño máximo: 5MB por imagen.
              </p>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Imágenes seleccionadas ({formData.images.length})</h3>
                {formData.images.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    Arrastra para reordenar. La primera imagen será la portada.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <Card key={index} className={index === 0 ? "border-2 border-emerald-500" : ""}>
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
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {index === 0 && <Badge className="absolute top-2 left-2 bg-emerald-500">Portada</Badge>}
                        {image.isNew && <Badge className="absolute bottom-2 right-2 bg-amber-500">Vista previa</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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
                value={formData.nutritionalInfo.calories || ""}
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
                value={formData.nutritionalInfo.protein || ""}
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
                value={formData.nutritionalInfo.carbs || ""}
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
                value={formData.nutritionalInfo.fat || ""}
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
