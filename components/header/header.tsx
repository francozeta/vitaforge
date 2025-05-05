import Link from "next/link"
import { HeaderClient } from "@/components/header/header-client"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter text-black">
              VitaForge
            </Link>
          </div>

          {/* Desktop Navigation - Rendering on the server*/}
          <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:space-x-8">
            <Link
              href="/products"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/products?category=680ac1bcd32da247f5e567cb"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Proteinas
            </Link>
            <Link
              href="/products?category=68157856c55e4abc0ead6f03"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Vitaminas
            </Link>
            <Link
              href="/products?category=6815786bc55e4abc0ead6f07"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Pre-Entrenamiento
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Ofertas
            </Link>
          </nav>

          {/* Client component for the dynamic part */}
          <HeaderClient />
        </div>
      </div>
    </header>
  )
}
