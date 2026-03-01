import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authenticateJWT, authorize } from "../middlewars/auth.middleware.js";

const router = Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", authenticateJWT, authorize("admin"), createProduct);

router.put("/:id", authenticateJWT, authorize("admin"), updateProduct);

router.delete("/:id", authenticateJWT, authorize("admin"), deleteProduct);

export default router;
