class TicketDTO {
  static toBasicDTO(ticket) {
    if (!ticket) return null;

    return {
      id: ticket._id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      status: ticket.status,
      totalProducts: ticket.products.length,
      createdAt: ticket.createdAt,
    };
  }

  static toFullDTO(ticket) {
    if (!ticket) return null;

    return {
      id: ticket._id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      status: ticket.status,
      products: ticket.products.map((item) => ({
        product: {
          id: item.product?._id,
          title: item.title,
          code: item.product?.code,
        },
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      user: ticket.user
        ? {
            id: ticket.user._id,
            email: ticket.user.email,
            name: `${ticket.user.first_name} ${ticket.user.last_name}`,
          }
        : null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  static toBasicDTOArray(tickets) {
    if (!Array.isArray(tickets)) return [];
    return tickets.map((ticket) => this.toBasicDTO(ticket));
  }

  static toListDTO(result) {
    return {
      tickets: this.toBasicDTOArray(result.tickets),
      pagination: result.pagination,
    };
  }
}

export default TicketDTO;
