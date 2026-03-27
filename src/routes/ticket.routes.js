import { Router } from "express";
import {
  processPurchase,
  getTicketByCode,
  getTicketById,
  getUserTickets,
  getAllTickets,
} from "../controllers/ticket.controller.js";
import { authenticateJWT, authorize } from "../middlewars/auth.middleware.js";

const router = Router();

router.post("/purcharse", authenticateJWT, processPurchase);

router.get("/my-tickets", authenticateJWT, getUserTickets);

router.get("/code/:code", authenticateJWT, getTicketByCode);

router.get("/:id", authenticateJWT, getTicketById);

router.get("/", authenticateJWT, authorize("admin"), getAllTickets);

export default router;
