"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario")
      }

      // Auto login after successful registration
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Ocurrió un error al registrar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre completo
            </Label>
            <div className="mt-1">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </Label>
            <div className="mt-1">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full"
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">¿Ya tienes una cuenta?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
