import TicketDAO from "../dao/ticket.dao.js";
import { v4 as uuidv4 } from "uuid";

class TicketRepository {
  constructor() {
    this.dao = TicketDAO;
  }

  generateTicketCode() {
    const prefix = process.env.TICKET_PREFIX || "TICKET";
    const uniqueId = uuidv4().split("-")[0].toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}-${uniqueId}`;
  }

  async create(ticketData) {
    if (!ticketData.code) {
      ticketData.code = this.generateTicketCode();
    }

    return await this.dao.create(ticketData);
  }

  async findByCode(code) {
    return await this.dao.findByCode(code);
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByUser(userId) {
    return await this.dao.findByUser(userId);
  }

  async findAll(queryParams = {}) {
    const { page = 1, limit = 10, status, userId } = queryParams;

    const filters = {};
    if (status) filters.status = status;
    if (userId) filters.user = userId;

    return await this.dao.findAll(filters, { page, limit });
  }

  async update(id, updates) {
    return await this.dao.update(id, updates);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export default new TicketRepository();
