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
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Check for admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url))
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
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
