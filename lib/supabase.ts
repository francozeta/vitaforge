import { createClient } from '@supabase/supabase-js'

// Crear un cliente de Supabase para el lado del cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para el lado del cliente (singleton)
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Cliente para el lado del servidor
export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Función para subir una imagen a Supabase Storage
export async function uploadProductImage(file: File, productId: string) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { data, error } = await getSupabaseClient()
      .storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(error.message)
    }

    // Obtener la URL pública de la imagen
    const { data: urlData } = getSupabaseClient()
      .storage
      .from('product-images')
      .getPublicUrl(filePath)

    return {
      path: filePath,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    throw error
  }
}

// Función para eliminar una imagen de Supabase Storage
export async function deleteProductImage(filePath: string) {
  try {
    const { error } = await getSupabaseClient()
      .storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error)
    throw error
  }
}
