import mongoose, { type Document, type Model, Schema } from "mongoose"
import { slugify } from "@/lib/utils"

// Definir la interfaz para el documento de Categoría
export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  image?: {
    url: string
    path: string
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Definir el esquema de Categoría
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Por favor proporcione un nombre de categoría"],
      trim: true,
      maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, "La descripción no puede tener más de 500 caracteres"],
    },
    image: {
      url: String,
      path: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Middleware para generar el slug antes de guardar
CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name)
  }
  next()
})

// Prevenir que mongoose cree un nuevo modelo si ya existe
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

export default Category
