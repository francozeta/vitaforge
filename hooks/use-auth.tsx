"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseAuthOptions {
  required?: boolean
  redirectTo?: string
  requiredRole?: string | string[]
}

export function useAuth({ required = false, redirectTo = "/login", requiredRole }: UseAuthOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const isAuthorized = checkAuthorization(session, requiredRole)

  useEffect(() => {
    // Si la autenticación aún está cargando, no hacer nada
    if (isLoading) return

    // Si se requiere autenticación y el usuario no está autenticado, redirigir
    if (required && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    // Si se requiere un rol específico y el usuario no está autorizado, redirigir
    if (requiredRole && !isAuthorized) {
      router.push("/unauthorized")
      return
    }
  }, [isLoading, isAuthenticated, isAuthorized, required, redirectTo, requiredRole, router])

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isAuthorized,
  }
}

function checkAuthorization(session: any, requiredRole?: string | string[]) {
  if (!session || !requiredRole) return true

  const userRole = session.user?.role || "user"

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }

  return userRole === requiredRole
}
