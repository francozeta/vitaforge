"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { MobileMenu } from "@/components/header/mobile-menu"
import { CartButton } from "@/components/header/cart-button"
import { UserAuthDisplay } from "@/components/header/user-auth-display"
import { useSession } from "next-auth/react"

export function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(3) // Mock cart items count
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* User avatar/menu - Desktop */}
        <div className="hidden lg:block">
          <UserAuthDisplay isLoading={!mounted || isLoading} session={mounted ? session : null} />
        </div>

        {/* Mobile user avatar */}
        <div className="lg:hidden">
          <UserAuthDisplay
            isLoading={!mounted || isLoading}
            session={mounted ? session : null}
            isMobile={true}
            onMobileMenuOpen={() => setIsMenuOpen(true)}
          />
        </div>

        {/* Cart button */}
        <CartButton count={cartItemsCount} isLoading={!mounted || isLoading} />

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          disabled={!mounted || isLoading}
        >
          {!mounted || isLoading ? <div className="h-6 w-6 rounded bg-gray-200"></div> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu using Drawer component */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={!!session}
        userRole={session?.user?.role}
        userName={session?.user?.name}
        isLoading={!mounted || isLoading}
      />
    </>
  )
}
