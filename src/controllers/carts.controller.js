import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const total = await cart.calculateTotal();

    res.json({
      status: "success",
      cart,
      total,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener carrito",
      error: error.message,
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Stock insuficiente",
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === pid,
    );

    if (existingProduct) {
      existingProduct.quantity += Number(quantity);
    } else {
      cart.products.push({
        product: pid,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    await cart.populate("products.product");

    const total = await cart.calculateTotal();

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      cart,
      total,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
      error: error.message,
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

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid,
    );

    if (!productInCart) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    const product = await Product.findById(pid);
    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Stock insuficiente",
      });
    }

    productInCart.quantity = Number(quantity);
    await cart.save();
    await cart.populate("products.product");

    const total = await cart.calculateTotal();

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      cart,
      total,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar cantidad",
      error: error.message,
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid,
    );

    await cart.save();
    await cart.populate("products.product");

    const total = await cart.calculateTotal();

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      cart,
      total,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto del carrito",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    cart.products = [];
    await cart.save();

    res.json({
      status: "success",
      message: "Carrito vaciado",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al vaciar carrito",
      error: error.message,
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
