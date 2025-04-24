import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function generateSKU(categoryPrefix = "SUP", productName = ""): string {
  // Obtener las primeras 3 letras del nombre del producto (o menos si es más corto)
  const namePrefix = productName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase()

  // Generar un ID único de 6 caracteres
  const uniqueId = nanoid(6).toUpperCase()

  // Combinar para formar el SKU
  return `${categoryPrefix}-${namePrefix || "XXX"}-${uniqueId}`
}