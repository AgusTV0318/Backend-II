import ProductRepository from "../repositories/product.repository.js";
import ProductDTO from "../dto/product.dto.js";

class ProductService {
  constructor() {
    this.repository = ProductRepository;
  }

  async getAllProducts(queryParams) {
    const result = await this.repository.findAll(queryParams);
    return ProductDTO.toListDTO(result);
  }

  async getProductById(id) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return ProductDTO.toFullDTO(product);
  }

  async createProduct(productData) {
    const codeExists = await this.repository.codeExists(productData.code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = await this.repository.create(productData);
    return ProductDTO.toFullDTO(newProduct);
  }

  async updateProduct(id, updates) {
    if (updates.code) {
      const codeExists = await this.repository.codeExists(updates.code, id);
      if (codeExists) {
        throw new Error("El código del producto ya existe");
      }
    }

    const updatedProduct = await this.repository.update(id, updates);

    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }

    return ProductDTO.toFullDTO(updatedProduct);
  }

  async deleteProduct(id) {
    const deletedProduct = await this.repository.delete(id);

    if (!deletedProduct) {
      throw new Error("Producto no encontrado");
    }

    return { message: "Producto eliminado exitosamente" };
  }

  async checkStock(productId, quantity) {
    const hasStock = await this.repository.hasStock(productId, quantity);

    if (!hasStock) {
      const product = await this.repository.findById(productId);
      throw new Error(`Stock insuficiente. Disponible: ${product?.stock || 0}`);
    }

    return true;
  }
}

export default new ProductService();
