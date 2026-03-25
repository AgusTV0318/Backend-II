import TicketService from "../services/ticket.service.js";

export const processPurchase = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await TicketService.processPurchase(userId);

    if (result.productsWithoutStock) {
      return res.status(206).json({
        status: "partial_success",
        message:
          "Compra procesada parcialmente. Algunos productos no tenían stock suficiente.",
        ticket: result.ticket,
        productsWithoutStock: result.productsWithoutStock,
        summary: result.summary,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Compra realizada exitosamente",
      ticket: result.ticket,
      summary: result.summary,
    });
  } catch (error) {
    const statusCode =
      error.message === "El carrito está vacío"
        ? 400
        : error.message === "Usuario no encontrado"
          ? 404
          : error.message === "No hay productos disponibles para comprar"
            ? 400
            : 500;

    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTicketByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const ticket = await TicketService.getTicketByCode(code);

    res.json({
      status: "success",
      ticket,
    });
  } catch (error) {
    const statusCode = error.message === "Ticket no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await TicketService.getTicketById(id);

    res.json({
      status: "success",
      ticket,
    });
  } catch (error) {
    const statusCode = error.message === "Ticket no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await TicketService.getUserTickets(userId);

    res.json({
      status: "success",
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const result = await TicketService.getAllTickets(req.query);

    res.json({
      status: "success",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  processPurchase,
  getTicketByCode,
  getTicketById,
  getUserTickets,
  getAllTickets,
};
