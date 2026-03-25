import Ticket from "../models/Ticket.model.js";

class TicketDAO {
  async create(ticketData) {
    try {
      return await Ticket.create(ticketData);
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Ticket.findOne({ code: code.toUpperCase() })
        .populate("user", "-password")
        .populate("products.product");
    } catch (error) {
      throw new Error(`Error al buscar ticket: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Ticket.findById(id)
        .populate("user", "-password")
        .populate("products.product");
    } catch (error) {
      throw new Error(`Error al buscar ticket: ${error.message}`);
    }
  }

  async findByUser(userId) {
    try {
      return await Ticket.find({ user: userId })
        .populate("products.product")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener tickets del usuario: ${error.message}`);
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

      const skip = (page - 1) * limit;

      const tickets = await Ticket.find(filters)
        .populate("user", "-password")
        .populate("products.product")
        .sort(sort)
        .limit(Number(limit))
        .skip(skip);

      const total = await Ticket.countDocuments(filters);

      return {
        tickets,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  async update(id, updates) {
    try {
      return await Ticket.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Ticket.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar ticket: ${(error, message)}`);
    }
  }
}

export default new TicketDAO();
