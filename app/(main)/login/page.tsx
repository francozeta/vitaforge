import LoginForm from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión | VitaForge",
  description: "Inicia sesión en tu cuenta de VitaForge para acceder a tus pedidos y más.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para gestionar tus pedidos y más</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
