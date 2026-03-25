import CartDAO from "../dao/cart.dao.js";

class CartRepository {
  constructor() {
    this.dao = CartDAO;
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByUser(userId) {
    return await this.dao.findByUser(userId);
  }

  async create(cartData = { products: [] }) {
    return await this.dao.create(cartData);
  }

  async addProduct(cartId, productId, quantity) {
    return await this.dao.addProduct(cartId, productId, quantity);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return await this.dao.removeProduct(cartId, productId);
  }

  async clear(cartId) {
    return await this.dao.clear(cartId);
  }

  async delete(cartId) {
    return await this.dao.delete(cartId);
  }

  async calculateTotal(cartId) {
    const cart = await this.dao.findById(cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}

export default new CartRepository();
