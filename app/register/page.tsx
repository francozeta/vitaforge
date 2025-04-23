import RegisterForm from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro | VitaForge",
  description: "Crea una cuenta en VitaForge para comprar suplementos deportivos.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">Regístrate para comenzar a comprar en VitaForge</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
