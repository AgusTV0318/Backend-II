import Product from "../models/Product.model.js";

class ProductDAO {
  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Product.findOne({ code: code.toUpperCase() });
    } catch (error) {
      throw new Error(`Error al buscar producto por código: ${error.message}`);
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort = {} } = options;

      const query = { status: true, ...filters };
      const skip = (page - 1) * limit;

      const products = await Product.countDocuments(query);

      return {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async update(id, updates) {
    try {
      return await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { status: false },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async updateStock(id, quantity) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  async checkStock(id, quantity) {
    try {
      const product = await Product.findById(id);
      return product && product.stock >= quantity;
    } catch (error) {
      throw new Error(`Error al verificar stock: ${error.message}`);
    }
  }
}

export default new ProductDAO();
