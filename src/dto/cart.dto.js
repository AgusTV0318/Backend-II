class CartDTO {
  static toDTO(cart) {
    if (!cart) return null;

    const products = cart.products.map((item) => ({
      product: item.product
        ? {
            id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            thumbnail: item.product.thumbnails?.[0] || null,
            stock: item.product.stock,
            available: item.product.stock >= item.quantity,
          }
        : null,
      quantity: item.quantity,
      subtotal: item.product ? item.product.price * item.quantity : 0,
    }));

    const total = products.reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart._id,
      products,
      total,
      totalItems,
      user: cart.user,
    };
  }
}

export default CartDTO;
