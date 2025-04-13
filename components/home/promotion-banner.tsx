import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PromotionBanner() {
  return (
    <section className="container px-4 mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-neutral-950 px-6 py-12 sm:px-12">
        <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Summer Sale: 20% Off All Products
            </h2>
            <p className="mt-3 text-gray-300">
              Limited time offer. Use code <span className="font-semibold">SUMMER20</span> at checkout.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-neutral-950 hover:bg-gray-100">
            <Link href="/deals">Shop the Sale</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
