class ProductDTO {
  static toBasicDTO(product) {
    if (!product) return null;

    return {
      id: product._id,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      size: product.size,
      resolution: product.resolution,
      thumbnail: product.thumbnails?.[0] || null,
      available: product.stock > 0,
    };
  }

  static toFullDTO(product) {
    if (!product) return null;

    return {
      ...this.toBasicDTO(product),
      thumbnails: product.thumbnails || [],
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toBaiscDTOArray(products) {
    if (!Array.isArray(products)) return [];
    return products.map((product) => this.toBasicDTO(product));
  }

  static toListDTO(result) {
    return {
      products: this.toBaiscDTOArray(result.products),
      pagination: result.pagination,
    };
  }
}

export default ProductDTO;
