import ProductService from "../services/product.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await ProductService.getAllProducts(req.query);

    res.json({
      status: "success",
      ...result,
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

    const product = await ProductService.getProductById(id);

    res.json({
      status: "success",
      product,
    });
  } catch (error) {
    const statusCode = error.message === "Producto no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: erro.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);

    res.status(201).json({
      status: "success",
      message: "Producto creado exitosamente",
      product,
    });
  } catch (error) {
    const statusCode = error.message.includes("ya existe") ? 400 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.updateProduct(id, req.body);

    res.json({
      status: "success",
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    const statusCode =
      error.message === "Producto no encontrado"
        ? 404
        : error.message.includes("ya existe")
          ? 400
          : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.deleteProduct(id);

    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message === "Producto no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
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
