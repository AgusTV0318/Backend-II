import Cart from "../models/Cart.model.js";

class CartDAO {
  async findById(id) {
    try {
      return await Cart.findById(id).populate("products.product");
    } catch (error) {
      throw new Error(`Error al buscar carrito: ${error.message}`);
    }
  }

  async findByUser(userId) {
    try {
      return await Cart.findOne({ user: userId }).populate("products.product");
    } catch (error) {
      throw new Error(`Error al buscar carrito del usuario: ${error.message}`);
    }
  }

  async create(cartData) {
    try {
      return await Cart.create(cartData);
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async update(id, cartData) {
    try {
      return await Cart.findByIdAndUpdate(id, cartData, { new: true }).populate(
        "products.product",
      );
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }

  async addProduct(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = cart.products.find(
        (item) => item.product.toString() === productId,
      );

      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }

      product.quantity = quantity;
      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId,
      );

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`,
      );
    }
  }

  async clear(cartId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error(`Error al vaciar carrito: ${error.message}`);
    }
  }

  async delete(cartId) {
    try {
      return await Cart.findByIdAndDelete(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar carrito: ${error.message}`);
    }
  }
}

export default new CartDAO();
