import { Router } from "express";
import {
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
} from "../controllers/carts.controller.js";
import { authenticateJWT } from "../middlewars/auth.middleware.js";

const router = Router();

router.get("/:id", authenticateJWT, getCartById);

router.post("/:cid/products/:pid", authenticateJWT, addProductToCart);

router.put("/:cid/products/:pid", authenticateJWT, updateProductQuantity);

router.delete("/:cid/products/:pid", authenticateJWT, removeProductFromCart);

router.delete("/:cid", authenticateJWT, clearCart);

export default router;
