import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsList from "@/components/products/products-list"
import ProductsFilters from "@/components/products/products-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Productos | VitaForge",
  description: "Explora nuestra amplia gama de suplementos deportivos de alta calidad.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Await searchParams before accessing its properties
  const params = await searchParams

  // Extraer parámetros de búsqueda
  const category = typeof params.category === "string" ? params.category : undefined
  const search = typeof params.search === "string" ? params.search : undefined
  const page = typeof params.page === "string" ? Number.parseInt(params.page) : 1
  const sort = typeof params.sort === "string" ? params.sort : undefined

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Sidebar de filtros - ocupa 3 columnas en tablet/desktop */}
        <div className="md:col-span-3 lg:col-span-2">
          <ProductsFilters selectedCategory={category} />
        </div>

        {/* Lista de productos - ocupa 9 columnas en tablet/desktop */}
        <div className="md:col-span-9 lg:col-span-10">
          <Suspense fallback={<ProductsLoadingSkeleton />}>
            <ProductsList category={category} search={search} page={page} sort={sort} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-36 md:h-6 md:w-48" />
        <Skeleton className="h-9 w-32 md:h-10 md:w-[180px]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-3 md:p-4">
              <Skeleton className="h-4 md:h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 md:h-4 w-full mb-1" />
              <Skeleton className="h-3 md:h-4 w-4/5 mb-1" />
              <Skeleton className="h-4 md:h-5 w-1/4 mt-2" />
            </div>
            <div className="px-3 pb-3 md:px-4 md:pb-4">
              <Skeleton className="h-8 md:h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
