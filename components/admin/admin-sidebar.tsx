"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categorías",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Promociones",
    href: "/admin/promotions",
    icon: Tag,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-black text-white transition-all duration-300 ease-in-out relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Botón para colapsar/expandir */}
      <button
        className="absolute -right-3 top-9 bg-neutral-900 text-white p-1 rounded-full border border-neutral-700"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-neutral-800">
        <Link href="/admin/dashboard" className="flex items-center">
          {collapsed ? (
            <span className="text-xl font-bold">VF</span>
          ) : (
            <span className="text-xl font-bold">VitaForge Admin</span>
          )}
        </Link>
      </div>

      {/* Navegación */}
      <nav className="p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Separador */}
      <div className="border-t border-neutral-800 my-4"></div>

      {/* Botón de cerrar sesión */}
      <div className="p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 justify-start",
          )}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
