"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import User, { type IShippingAddress } from "@/models/User"
import dbConnect from "@/lib/db"
import mongoose from "mongoose"

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return { success: false, message: "No autorizado" }
    }

    await dbConnect()

    const name = formData.get("name") as string

    if (!name || name.trim().length < 2) {
      return { success: false, message: "El nombre debe tener al menos 2 caracteres" }
    }

    const user = await User.findOneAndUpdate({ email: session.user.email }, { name }, { new: true })

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    revalidatePath("/profile")
    return { success: true, message: "Perfil actualizado correctamente" }
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return { success: false, message: "Error al actualizar el perfil" }
  }
}

export async function addShippingAddress(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return { success: false, message: "No autorizado" }
    }

    await dbConnect()

    const street = formData.get("street") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const phone = formData.get("phone") as string
    const isDefault = formData.get("isDefault") === "on"

    if (!street || !city || !state || !postalCode || !country || !phone) {
      return { success: false, message: "Todos los campos son obligatorios" }
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    // Si la nueva dirección es predeterminada, actualizar las existentes
    if (isDefault) {
      user.shippingAddresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Si es la primera dirección, hacerla predeterminada
    const makeDefault = isDefault || user.shippingAddresses.length === 0

    // Crear la nueva dirección con el tipo correcto
    const newAddress: IShippingAddress = {
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: makeDefault,
    }

    user.shippingAddresses.push(newAddress)

    await user.save()

    revalidatePath("/profile")
    return { success: true, message: "Dirección añadida correctamente" }
  } catch (error) {
    console.error("Error al añadir dirección:", error)
    return { success: false, message: "Error al añadir la dirección" }
  }
}

export async function updateShippingAddress(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return { success: false, message: "No autorizado" }
    }

    await dbConnect()

    const addressId = formData.get("addressId") as string
    const street = formData.get("street") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const phone = formData.get("phone") as string
    const isDefault = formData.get("isDefault") === "on"

    if (!addressId || !street || !city || !state || !postalCode || !country || !phone) {
      return { success: false, message: "Todos los campos son obligatorios" }
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    // Si la dirección actualizada es predeterminada, actualizar las existentes
    if (isDefault) {
      user.shippingAddresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Usar una verificación segura para el _id
    const addressIndex = user.shippingAddresses.findIndex((addr) => {
      // Verificar si _id existe antes de llamar a toString()
      return addr._id && addr._id.toString() === addressId
    })

    if (addressIndex === -1) {
      return { success: false, message: "Dirección no encontrada" }
    }

    // Actualizar la dirección directamente sin usar toObject()
    user.shippingAddresses[addressIndex].street = street
    user.shippingAddresses[addressIndex].city = city
    user.shippingAddresses[addressIndex].state = state
    user.shippingAddresses[addressIndex].postalCode = postalCode
    user.shippingAddresses[addressIndex].country = country
    user.shippingAddresses[addressIndex].phone = phone
    user.shippingAddresses[addressIndex].isDefault = isDefault

    await user.save()

    revalidatePath("/profile")
    return { success: true, message: "Dirección actualizada correctamente" }
  } catch (error) {
    console.error("Error al actualizar dirección:", error)
    return { success: false, message: "Error al actualizar la dirección" }
  }
}

export async function deleteShippingAddress(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return { success: false, message: "No autorizado" }
    }

    await dbConnect()

    const addressId = formData.get("addressId") as string

    if (!addressId) {
      return { success: false, message: "ID de dirección no proporcionado" }
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    // Usar una verificación segura para el _id
    const addressIndex = user.shippingAddresses.findIndex((addr) => {
      // Verificar si _id existe antes de llamar a toString()
      return addr._id && addr._id.toString() === addressId
    })

    if (addressIndex === -1) {
      return { success: false, message: "Dirección no encontrada" }
    }

    const wasDefault = user.shippingAddresses[addressIndex].isDefault

    // Eliminar la dirección
    user.shippingAddresses.splice(addressIndex, 1)

    // Si la dirección eliminada era la predeterminada y hay otras direcciones,
    // hacer que la primera sea la predeterminada
    if (wasDefault && user.shippingAddresses.length > 0) {
      user.shippingAddresses[0].isDefault = true
    }

    await user.save()

    revalidatePath("/profile")
    return { success: true, message: "Dirección eliminada correctamente" }
  } catch (error) {
    console.error("Error al eliminar dirección:", error)
    return { success: false, message: "Error al eliminar la dirección" }
  }
}

export async function getUserData() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return null
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      shippingAddresses: user.shippingAddresses.map((addr) => ({
        id: addr._id ? addr._id.toString() : new mongoose.Types.ObjectId().toString(), // Manejar caso donde _id podría ser undefined
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone || "",
        isDefault: addr.isDefault,
      })),
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error)
    return null
  }
}
