class UserDTO {
  static toBasicDTO(user) {
    if (!user) return null;

    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
        ? typeof user.cart === "object"
          ? user.cart._id
          : user.cart
        : null,
    };
  }

  static toFullDTO(user) {
    if (!user) return null;

    const basicDTO = this.toBasicDTO(user);

    if (user.cart && typeof user.cart === " object " && user.cart.products) {
      basicDTO.cart = {
        id: user.cart._id,
        products: user.cart.products.map((item) => ({
          product: item.product
            ? {
                id: item.product._id,
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnails?.[0] || null,
              }
            : null,
          quantity: item.quantity,
        })),
        totalItems: user.cart.products.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      };
    }

    return basicDTO;
  }

  static toBasicDTOArray(users) {
    if (!Array.isArray(users)) return [];
    return users.map((user) => this.toBasicDTO(user));
  }

  static toAuthDTO(user, token) {
    return {
      user: this.toBasicDTO(user),
      token,
    };
  }
}

export default UserDTO;
