"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.url) {
        router.push(result.url)
      } else {
        router.push(callbackUrl)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError("Ocurrió un error al iniciar sesión")
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">¿No tienes una cuenta?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
