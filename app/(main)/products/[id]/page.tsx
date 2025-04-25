import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import Category from "@/models/Category"

interface ProductPageProps {
  params: {
    id: string
  }
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  await dbConnect()

  try {
    const product = await Product.findById(params.id)

    if (!product) {
      return {
        title: "Producto no encontrado | VitaForge",
      }
    }

    return {
      title: `${product.name} | VitaForge`,
      description: product.shortDescription,
    }
  } catch (error) {
    return {
      title: "Producto | VitaForge",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await dbConnect()

  let product
  let category

  try {
    // Obtener producto por ID
    product = await Product.findById(params.id)

    if (!product) {
      notFound()
    }

    // Obtener categoría del producto
    category = await Category.findById(product.category)
  } catch (error) {
    console.error("Error al cargar producto:", error)
    notFound()
  }

  // Convertir a objeto plano para evitar problemas con las fechas y ObjectId
  product = JSON.parse(JSON.stringify(product))
  category = category ? JSON.parse(JSON.stringify(category)) : { name: "Sin categoría" }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0]?.url || "/placeholder.svg?height=600&width=600&query=product"}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.featured && (
              <Badge className="absolute right-3 top-3 bg-black text-white hover:bg-black/80">Destacado</Badge>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image: any, index: number) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.name} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">Categoría: {category.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-lg">{product.shortDescription}</p>

          <div className="pt-4">
            <Button size="lg" className="w-full md:w-auto">
              Añadir al Carrito
            </Button>
          </div>

          <div className="border-t pt-6 mt-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full mb-2">
                <TabsTrigger value="description" className="flex-1 text-xs sm:text-sm">
                  Descripción
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex-1 text-xs sm:text-sm">
                  Info. Nutricional
                </TabsTrigger>
                <TabsTrigger value="ingredients" className="flex-1 text-xs sm:text-sm">
                  Ingredientes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-4">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Tamaño de porción</p>
                      <p className="font-medium">{product.nutritionalInfo.servingSize}</p>
                    </div>
                    <div className="border p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Porciones por envase</p>
                      <p className="font-medium">{product.nutritionalInfo.servingsPerContainer}</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse">
                    <tbody>
                      {product.nutritionalInfo.calories !== undefined && (
                        <tr className="border-b">
                          <td className="py-2">Calorías</td>
                          <td className="py-2 text-right font-medium">{product.nutritionalInfo.calories}</td>
                        </tr>
                      )}
                      {product.nutritionalInfo.protein !== undefined && (
                        <tr className="border-b">
                          <td className="py-2">Proteínas</td>
                          <td className="py-2 text-right font-medium">{product.nutritionalInfo.protein}g</td>
                        </tr>
                      )}
                      {product.nutritionalInfo.carbs !== undefined && (
                        <tr className="border-b">
                          <td className="py-2">Carbohidratos</td>
                          <td className="py-2 text-right font-medium">{product.nutritionalInfo.carbs}g</td>
                        </tr>
                      )}
                      {product.nutritionalInfo.fat !== undefined && (
                        <tr className="border-b">
                          <td className="py-2">Grasas</td>
                          <td className="py-2 text-right font-medium">{product.nutritionalInfo.fat}g</td>
                        </tr>
                      )}
                      {product.nutritionalInfo.additionalInfo &&
                        Object.entries(product.nutritionalInfo.additionalInfo).map(([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-2">{key}</td>
                            <td className="py-2 text-right font-medium">{value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="pt-4">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {product.ingredients.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay información de ingredientes disponible.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
