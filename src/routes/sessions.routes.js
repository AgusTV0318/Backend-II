import { Router } from "express";
import {
  register,
  login,
  logout,
  current,
} from "../controllers/sessions.controller.js";
import { authenticateCurrent } from "../middlewars/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/current", authenticateCurrent, current);

export default router;
