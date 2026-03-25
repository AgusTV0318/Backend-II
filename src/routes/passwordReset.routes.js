import { Router } from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/passwordReset.controller.js";

const router = Router();

/**
 * Body : { email }
 */
router.post("/request", requestPasswordReset);

/**
 * Body : { token, newPassword}
 */
router.post("/reset", resetPassword);

export default router;
