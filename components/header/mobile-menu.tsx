"use client"

import Link from "next/link"
import { ChevronRight, LogOut, User } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { UserAvatar } from "@/components/ui/user-avatar"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  userRole?: string
  userName?: string
  isLoading?: boolean
}

export function MobileMenu({ isOpen, onClose, isAuthenticated, userRole, userName, isLoading }: MobileMenuProps) {
  if (!isOpen) return null

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
    onClose()
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-neutral-200">
          <DrawerTitle>Menu</DrawerTitle>
          {isLoading ? (
            <DrawerDescription className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-200"></div>
              <div className="h-4 w-24 rounded bg-neutral-200"></div>
            </DrawerDescription>
          ) : isAuthenticated ? (
            <DrawerDescription className="flex items-center gap-2">
              <UserAvatar size="sm" />
              <span>Hola, {userName || "Usuario"}</span>
            </DrawerDescription>
          ) : (
            <DrawerDescription className="flex items-center gap-2">
              <div className="p-1 text-neutral-700">
                <User className="h-5 w-5" />
              </div>
              <span>Invitado</span>
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-auto p-4">
          <nav className="space-y-1">
            <Link
              href="/products"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">All Products</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/categories/proteins"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Proteins</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/categories/vitamins"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Vitamins & Minerals</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/categories/pre-workout"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Pre-Workout</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/categories/weight-management"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Weight Management</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>

            <Link
              href="/deals"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Deals</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>
          </nav>

          <div className="mt-4 space-y-1">
            {isLoading ? (
              <>
                <div className="flex items-center justify-between py-3 px-2 border-b border-neutral-100">
                  <div className="h-6 w-24 rounded bg-neutral-200"></div>
                  <div className="h-5 w-5 rounded bg-neutral-200"></div>
                </div>
                <div className="flex items-center justify-between py-3 px-2 border-b border-neutral-100">
                  <div className="h-6 w-24 rounded bg-neutral-200"></div>
                  <div className="h-5 w-5 rounded bg-neutral-200"></div>
                </div>
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  href='/profile'
                  className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
                  onClick={onClose}
                >
                  <span className="text-base font-medium">Mi Cuenta</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
                  onClick={onClose}
                >
                  <span className="text-base font-medium">Mis Pedidos</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>

                {userRole === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
                    onClick={onClose}
                  >
                    <span className="text-base font-medium">Panel de Administración</span>
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-between py-3 px-2 border-b border-neutral-100 text-left"
                >
                  <span className="text-base font-medium text-red-600">Cerrar Sesión</span>
                  <LogOut className="h-5 w-5 text-red-600" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
                  onClick={onClose}
                >
                  <span className="text-base font-medium">Iniciar Sesión</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>

                <Link
                  href="/register"
                  className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
                  onClick={onClose}
                >
                  <span className="text-base font-medium">Registrarse</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>
              </>
            )}

            <Link
              href="/cart"
              className="flex items-center justify-between py-3 px-2 border-b border-neutral-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Shopping Cart</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
