import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: "true",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La cantidad de ser de al menos 1"],
          default: 1,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.methods.calculateTotal = async function () {
  await this.populate("products.product");
  return this.products.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
