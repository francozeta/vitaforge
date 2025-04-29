"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { LogOut, User, Settings, ShoppingBag } from "lucide-react"

interface UserMenuProps {
  userName: string
  userRole: string
}

export function UserMenu({ userName, userRole }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={menuRef}>
      <UserAvatar onClick={toggleMenu} />

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg border border-neutral-200 none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="border-b border-neutral-200 px-4 py-2">
            <p className="text-sm font-medium text-gray-900">Hola, {userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>

          <Link
            href='/profile'
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <User className="mr-2 h-4 w-4" />
            Mi Cuenta
          </Link>

          <Link
            href="/orders"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mis Pedidos
          </Link>

          {userRole === "admin" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Settings className="mr-2 h-4 w-4" />
              Panel de Administración
            </Link>
          )}

          <button
            onClick={() => {
              signOut({ callbackUrl: "/" })
              setIsOpen(false)
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            role="menuitem"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
}
