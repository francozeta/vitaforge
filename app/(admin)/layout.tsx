import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Geist } from "next/font/google"
import "@/app/globals.css";
import AuthProvider from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verificar si el usuario está autenticado y es administrador
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <html>
      <body
        className={`${geistSans.className} antialiased`}
      >
        <AuthProvider>

          <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Contenido principal */}
            <main className="flex-1 overflow-auto">{children}</main>
            <Toaster position="bottom-right" />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
