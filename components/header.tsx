"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
import { MobileMenu } from "@/components/header/mobile-menu"
import { CartButton } from "@/components/header/cart-button"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(3) // Mock cart items count

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter text-black">
              VitaForge
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:space-x-8">
            <Link
              href="/products"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              All Products
            </Link>
            <Link
              href="/categories/proteins"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Proteins
            </Link>
            <Link
              href="/categories/vitamins"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Vitamins
            </Link>
            <Link
              href="/categories/pre-workout"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Pre-Workout
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Deals
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User account icon */}
            <Link href="/account" className="p-2 text-gray-700 hover:text-black">
              <User className="h-6 w-6" />
              <span className="sr-only">My Account</span>
            </Link>

            {/* Cart button */}
            <CartButton count={cartItemsCount} />

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu using Drawer component */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
