import TicketRepository from "../repositories/ticket.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import UserRepository from "../repositories/user.repository.js";
import TicketDTO from "../dto/ticket.dto.js";

class TicketService {
  constructor() {
    this.ticketRepository = TicketRepository;
    this.cartRepository = CartRepository;
    this.productRepository = ProductRepository;
    this.userRepository = UserRepository;
  }

  async processPurchase(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const cart = await this.cartRepository.findById(user.cart);
    if (!cart || cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const productsWithStock = [];
    const productsWithoutStock = [];

    for (const item of cart.products) {
      const product = await this.productRepository.findById(item.product._id);

      if (!product) {
        productsWithoutStock.push({
          productId: item.product._id,
          title: item.product.title,
          requestedQuantity: item.quantity,
          reason: "Producto no encontrado",
        });
        continue;
      }

      if (product.stock >= item.quantity) {
        productsWithStock.push({
          product: product,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity,
        });
      } else {
        productsWithoutStock.push({
          productId: product._id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          reason: "Stock insuficiente",
        });
      }
    }

    if (productsWithStock.length === 0) {
      throw new Error("No hay productos disponibles para comprar");
    }

    const totalAmount = productsWithStock.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const ticketData = {
      purchaser: user.email,
      amount: totalAmount,
      user: user._id,
      products: productsWithStock.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    };

    const ticket = await this.ticketRepository.create(ticketData);

    for (const item of productsWithStock) {
      await this.productRepository.updateStock(
        item.product._id,
        -item.quantity,
      );
    }

    const purchasedProductIds = productsWithStock.map((item) =>
      item.product._id.toString(),
    );
    cart.products = cart.products.filter(
      (item) => !purchasedProductIds.includes(item.product._id.toString()),
    );
    await cart.save();
    return {
      ticket: TicketDTO.toFullDTO(ticket),
      productsWithoutStock:
        productsWithoutStock.length > 0 ? productsWithoutStock : null,
      summary: {
        totalPurchased: productsWithStock.length,
        totalNotPurchased: productsWithoutStock.length,
        totalAmount: totalAmount,
      },
    };
  }

  async getTicketByCode(code) {
    const ticket = await this.ticketRepository.findByCode(code);

    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }

    return TicketDTO.toFullDTO(ticket);
  }

  async getTicketById(id) {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }

    return TicketDTO.toFullDTO(ticket);
  }

  async getUserTickets(userId) {
    const tickets = await this.ticketRepository.findByUser(userId);
    return tickets.map((ticket) => TicketDTO.toFullDTO(ticket));
  }

  async getAllTickets(queryParams) {
    const result = await this.ticketRepository.findAll(queryParams);
    return TicketDTO.toListDTO(result);
  }
}

export default new TicketService();
