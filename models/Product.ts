import mongoose, { type Document, type Model, Schema } from "mongoose"
import { slugify } from "@/lib/utils"

// Definir la interfaz para el documento de Producto
export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  stock: number
  sku: string
  images: {
    url: string
    path: string
    alt?: string
  }[]
  category: string
  tags: string[]
  ingredients: string[]
  nutritionalInfo: {
    servingSize: string
    servingsPerContainer: number
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    additionalInfo?: Record<string, string>
  }
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Definir el esquema de Producto
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Por favor proporcione un nombre de producto"],
      trim: true,
      maxlength: [100, "El nombre no puede tener más de 100 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Por favor proporcione una descripción"],
    },
    shortDescription: {
      type: String,
      required: [true, "Por favor proporcione una descripción corta"],
      maxlength: [200, "La descripción corta no puede tener más de 200 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "Por favor proporcione un precio"],
      min: [0, "El precio no puede ser negativo"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "El precio comparativo no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "Por favor proporcione la cantidad en stock"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, "Por favor proporcione un SKU"],
      unique: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
        alt: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Por favor seleccione una categoría"],
      enum: ["proteinas", "creatinas", "pre-entreno", "aminoacidos", "vitaminas", "quemadores", "otros"],
    },
    tags: [String],
    ingredients: [String],
    nutritionalInfo: {
      servingSize: {
        type: String,
        required: [true, "Por favor proporcione el tamaño de la porción"],
      },
      servingsPerContainer: {
        type: Number,
        required: [true, "Por favor proporcione el número de porciones por envase"],
        min: [1, "Debe haber al menos una porción por envase"],
      },
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      additionalInfo: {
        type: Map,
        of: String,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Middleware para generar el slug antes de guardar
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name)
  }
  next()
})

// Prevenir que mongoose cree un nuevo modelo si ya existe
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product
