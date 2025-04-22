import mongoose, { type Document, type Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "customer"
  isActive: boolean
  shippingAddresses: Array<{
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
  }>
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Por favor proporcione un nombre"],
      trim: true,
      maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "Por favor proporcione un email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor proporcione un email válido"],
    },
    password: {
      type: String,
      required: [true, "Por favor proporcione una contraseña"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    shippingAddresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Prevent mongoose from creating a new model if it already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
