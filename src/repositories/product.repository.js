import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
  constructor() {
    this.dao = ProductDAO;
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByCode(code) {
    return await this.dao.findByCode(code);
  }

  async findAll(queryParams = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    } = queryParams;

    const filters = {};
    if (category) filters.category = category;
    if (brand) filters.brand = new RegExp(brand, "i");
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    if (sort === "price_desc") sortOptions.price = -1;
    if (sort === "name_asc") sortOptions.title = 1;
    if (sort === "name_desc") sortOptions.title = -1;

    return await this.dao.findAll(filters, { page, limit, sort: sortOptions });
  }

  async create(productData) {
    return await this.dao.create(productData);
  }

  async update(id, updates) {
    return await this.dao.update(id, updates);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async updateStock(id, quantity) {
    return await this.dao.updateStock(id, quantity);
  }

  async hasStock(id, quantity) {
    return await this.dao.checkStock(id, quantity);
  }

  async codeExists(code, excludeId = null) {
    const product = await this.dao.findByCode(code);

    if (!product) return false;

    if (excludeId && product._id.toString() === excludeId) {
      return false;
    }

    return true;
  }
}

export default new ProductRepository();
