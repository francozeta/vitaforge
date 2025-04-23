import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip middleware for auth API routes
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isAdminLoginRoute = req.nextUrl.pathname === "/admin/login"
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (isAuthRoute || isAdminLoginRoute)) {
    // Si es admin y está en la página de login de admin, redirigir al dashboard
    if (token.role === "admin" && isAdminLoginRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // Si es usuario normal o admin en página de login normal, redirigir a inicio
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Check for admin routes (excepto la página de login de admin)
  if (isAdminRoute && !isAdminLoginRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login?callbackUrl=" + encodeURIComponent(req.url), req.url))
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/orders", "/checkout"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/checkout/:path*", "/login", "/register"],
}
