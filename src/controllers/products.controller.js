import Product from "../models/Product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filters = { status: true };

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

    const skip = (page - 1) * limit;

    const products = await Product.find(filters)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(filters);

    res.json({
      status: "success",
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener producto",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const existingProduct = await Product.findOne({ code: productData.code });
    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "El código del producto ya existe",
      });
    }

    const newProduct = await Product.create(productData);

    res.status(201).json({
      status: "success",
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.code) {
      const existingProduct = await Product.findOne({
        code: updates.code,
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(400).json({
          status: "error",
          message: "El código del producto ya existe",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
