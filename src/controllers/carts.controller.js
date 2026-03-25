import CartService from "../services/cart.service.js";

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartService.getCartById(id);

    res.json({
      status: "success",
      cart,
    });
  } catch (error) {
    const statusCode = error.message === "Carrito no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await CartService.addProductToCart(cid, pid, Number(quantity));

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      cart,
    });
  } catch (error) {
    const statusCode = error.message.includes("no encontrado")
      ? 404
      : error.message.includes("Stock")
        ? 400
        : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser mayor a 0",
      });
    }

    const cart = await CartService.updateProductQuantity(
      cid,
      pid,
      Number(quantity),
    );

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      cart,
    });
  } catch (error) {
    const statusCode = error.message.includes("no encontrado")
      ? 404
      : error.message.includes("Stock")
        ? 400
        : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartService.removeProductFromCart(cid, pid);

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    const statusCode = error.message.includes("no encontrado") ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.clearCart(cid);

    res.json({
      status: "success",
      message: "Carrito vaciado",
      cart,
    });
  } catch (error) {
    const statusCode = error.message === "Carrito no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
};
