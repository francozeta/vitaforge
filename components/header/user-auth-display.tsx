"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { UserMenu } from "@/components/header/user-menu"
import type { Session } from "next-auth"

interface UserAuthDisplayProps {
  isLoading: boolean
  session: Session | null
  isMobile?: boolean
  onMobileMenuOpen?: () => void
}

export function UserAuthDisplay({ isLoading, session, isMobile, onMobileMenuOpen }: UserAuthDisplayProps) {
  if (isLoading) {
    return <div className={`${isMobile ? "h-10 w-10" : "h-8 w-8"} rounded-full bg-gray-200 animate-pulse`}></div>
  }

  if (session) {
    return isMobile ? (
      <UserAvatar onClick={onMobileMenuOpen} />
    ) : (
      <UserMenu userName={session.user.name || "Usuario"} userRole={session.user.role || "customer"} />
    )
  }

  return (
    <Link href="/login" className="p-2 text-gray-700 hover:text-black">
      <User className="h-6 w-6" />
      <span className="sr-only">Iniciar Sesión</span>
    </Link>
  )
}
