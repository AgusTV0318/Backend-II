import CartRepository from "../repositories/cart.repository.js";
import ProductService from "./product.service.js";
import CartDTO from "../dto/cart.dto.js";

class CartService {
  constructor() {
    this.repository = CartRepository;
    this.productService = ProductService;
  }

  async getCartById(id) {
    const cart = await this.repository.findById(id);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return CartDTO.toDTO(cart);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    await this.productService.checkStock(productId, quantity);

    const cart = await this.repository.addProduct(cartId, productId, quantity);

    return CartDTO.toDTO(cart);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (quantity < 1) {
      throw new Error("La cantidad debe ser mayor a 0");
    }
    await this.productService.checkStock(productId, quantity);

    const cart = await this.repository.updateProductQuantity(
      cartId,
      productId,
      quantity,
    );

    return CartDTO.toDTO(cart);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.repository.removeProduct(cartId, productId);
    return CartDTO.toDTO(cart);
  }

  async clearCart(cartId) {
    const cart = await this.repository.clear(cartId);
    return CartDTO.toDTO(cart);
  }

  async calculateTotal(cartId) {
    return await this.repository.calculateTotal(cartId);
  }
}

export default new CartService();
