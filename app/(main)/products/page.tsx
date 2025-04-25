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

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extraer parámetros de búsqueda
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de filtros */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductsFilters selectedCategory={category} />
        </div>

        {/* Lista de productos */}
        <div className="flex-1">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-4/5 mb-1" />
              <Skeleton className="h-5 w-1/4 mt-2" />
            </div>
            <div className="p-4 pt-0">
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
