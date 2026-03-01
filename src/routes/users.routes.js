import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
} from "../controllers/users.controller.js";
import { authenticateJWT, authorize } from "../middlewars/auth.middleware.js";

const router = Router();

router.get("/", authenticateJWT, authorize("admin"), getAllUsers);

router.get("/:id", authenticateJWT, getUserById);

router.post("/", authenticateJWT, authorize("admin"), createUser);

router.put("/:id", authenticateJWT, updateUser);

router.delete("/:id", authenticateJWT, authorize("admin"), deleteUser);

router.patch("/:id/role", authenticateJWT, authorize("admin"), changeUserRole);

export default router;
