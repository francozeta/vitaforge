import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Premium Whey Protein",
    description: "25g of protein per serving with essential amino acids",
    price: 49.99,
    image: "/assorted-protein-powders.png",
    badge: "Best Seller",
    category: "proteins",
  },
  {
    id: 2,
    name: "Pre-Workout Energy",
    description: "Enhanced formula for maximum performance and focus",
    price: 39.99,
    image: "/energized-workout-essentials.png",
    badge: "New",
    category: "pre-workout",
  },
  {
    id: 3,
    name: "Multivitamin Complex",
    description: "Complete daily nutrition with 24 essential vitamins and minerals",
    price: 29.99,
    image: "/assorted-multivitamins.png",
    category: "vitamins",
  },
  {
    id: 4,
    name: "BCAA Recovery Formula",
    description: "Supports muscle recovery and reduces fatigue",
    price: 34.99,
    image: "/bcaa-powder-scoop.png",
    category: "recovery",
  },
]

export function FeaturedProducts() {
  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Products</h2>
          <p className="text-muted-foreground">Our most popular supplements, trusted by athletes worldwide.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                {product.badge && (
                  <Badge className="absolute right-2 top-2 bg-black text-white hover:bg-black/80">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/products/${product.id}`}>View Product</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline" className="mt-4">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
