import mongoose, { Schema, type Document, type Model } from "mongoose"

// Definir la interfaz para los detalles de pago
interface PaymentDetails {
  method: string
  transactionId: string
  amount: number
  currency: string
  paidAt: Date
}

// Definir la interfaz para la dirección de envío
interface ShippingAddress {
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
}

// Definir la interfaz para los items del pedido
interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// Definir la interfaz para el documento de Order
// Modificar la interfaz OrderDocument para incluir explícitamente _id
export interface OrderDocument extends Document {
  _id: mongoose.Types.ObjectId // Añadir esta línea explícitamente
  user: mongoose.Schema.Types.ObjectId
  items: OrderItem[]
  shippingAddress: ShippingAddress
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentDetails?: PaymentDetails
  createdAt: Date
  updatedAt: Date
}

// Crear el esquema para Order
const OrderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      method: { type: String },
      transactionId: { type: String },
      amount: { type: Number },
      currency: { type: String },
      paidAt: { type: Date },
    },
  },
  { timestamps: true },
)

// Crear y exportar el modelo
const Order: Model<OrderDocument> = mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema)

export default Order
