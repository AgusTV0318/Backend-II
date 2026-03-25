import UserDAO from "../dao/user.dao.js";

class UserRepository {
  constructor() {
    this.dao = UserDAO;
  }

  async findByEmail(email) {
    return await this.dao.findByEmail(email);
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async findByIdWithPassword(id) {
    return await this.dao.findByIdWithPassword(id);
  }

  async findAll() {
    return await this.dao.findAll();
  }

  async create(userData) {
    return await this.dao.create(userData);
  }

  async update(id, updates) {
    delete updates.cart;
    delete updates.password;

    return await this.dao.update(id, updates);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async updatePassword(id, hashedPassword) {
    return await this.dao.updatePassword(id, hashedPassword);
  }

  async emailExists(email, excludeId = null) {
    const user = await this.dao.findByEmail(email);

    if (!user) return false;

    if (excludeId && user._id.toString() === excludeId) {
      return false;
    }

    return true;
  }
}

export default new UserRepository();
