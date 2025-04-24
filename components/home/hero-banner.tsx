import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section className="container px-4 mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-neutral-950 px-6 py-16 sm:px-12 sm:py-24 md:py-32 ">
        <div className="relative flex flex-col items-center text-center">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl md:text-5xl lg:text-6xl">
            Suplementos premium para tu camino hacia el fitness
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300">
          Productos formulados científicamente para ayudarte a alcanzar tus objetivos de salud y bienestar. Ingredientes de calidad, resultados comprobados.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-neutral-50 text-black hover:bg-neutral-200">
              <Link href="/products">Comprar Ahora</Link>
            </Button>
            <Button asChild size="lg" className=" text-neutral-50 hover:bg-neutral-50/10">
              <Link href="/categories">Explorar Categorias</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
