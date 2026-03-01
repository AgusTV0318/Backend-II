import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    code: {
      type: String,
      required: [true, "El código es obligatorio"],
      unique: true,
      uppercase: true,
    },
    price: {
      type: String,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: ["LED", "OLED", "QLED", "Smart TV", "4K", "8K"],
      default: "Smart TV",
    },
    thumbnails: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
    },
    size: {
      type: String,
      required: [true, "El tamaño es obligatorio"],
    },
    resolution: {
      type: String,
      required: [true, "La resolución es obligatoria"],
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
