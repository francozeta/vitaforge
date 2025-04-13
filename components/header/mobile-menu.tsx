"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
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

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-gray-200">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Browse our products and categories</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-auto p-4">
          <nav className="space-y-1">
            <Link
              href="/products"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">All Products</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/categories/proteins"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Proteins</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/categories/vitamins"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Vitamins & Minerals</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/categories/pre-workout"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Pre-Workout</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/categories/weight-management"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Weight Management</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/deals"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Deals</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </nav>

          <div className="mt-4 space-y-1">
            <Link
              href="/account"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">My Account</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between py-3 px-2 border-b border-gray-100"
              onClick={onClose}
            >
              <span className="text-base font-medium">Shopping Cart</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
