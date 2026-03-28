import UserRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import UserDTO from "../dto/user.dto.js";
import { generateResetToken, verifyResetToken } from "../utils/resetToken.js";
import EmailService from "./email.service.js";

class UserService {
  constructor() {
    this.repository = UserRepository;
  }

  async register(userData) {
    const { first_name, last_name, email, age, password, role } = userData;

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Faltan campos obligatorios");
    }

    const emailExists = await this.repository.emailExists(email);
    if (emailExists) {
      throw new Error("El email ya está registrado");
    }

    const newUser = await this.repository.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: role || "user",
    });

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    return UserDTO.toAuthDTO(newUser, token);
  }

  async login(email, password) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    if (!isValidPassword(password, user.password)) {
      throw new Error("Credenciales inválidas");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return UserDTO.toAuthDTO(user, token);
  }

  async getCurrentUser(userId) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return UserDTO.toFullDTO(user);
  }

  async getAllUsers() {
    const users = await this.repository.findAll();
    return UserDTO.toBasicDTOArray(users);
  }

  async getUserById(id) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return UserDTO.toFullDTO(user);
  }

  async createUser(userData) {
    const { first_name, last_name, email, age, password, role } = userData;

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Faltan campos obligatorios");
    }

    const emailExists = await this.repository.emailExists(email);
    if (emailExists) {
      throw new Error("El email ya está registrado");
    }

    const newUser = await this.repository.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: role || "user",
    });

    return UserDTO.toBasicDTO(newUser);
  }

  async updateUser(id, updates) {
    if (updates.email) {
      const emailExists = await this.repository.emailExists(updates.email, id);
      if (emailExists) {
        throw new Error("El email ya está en uso");
      }
    }

    if (updates.password) {
      updates.password = createHash(updates.password);
    }

    const updatedUser = await this.repository.update(id, updates);

    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    return UserDTO.toBasicDTO(updatedUser);
  }

  async deleteUser(id) {
    const deleteUser = await this.repository.delete(id);

    if (!deleteUser) {
      throw new Error("Usuario no encontrado");
    }

    return { message: "Usuario eliminado exitosamente" };
  }

  async changeUserRole(id, role) {
    if (!["user", "admin", "premium"].includes(role)) {
      throw new Error("Rol inválido. Debe ser: usuario, admin o premium");
    }

    const updatedUser = await this.repository.update(id, { role });

    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    return UserDTO.toBasicDTO(updatedUser);
  }

  async updatePassword(userId, newPassword, oldPassword = null) {
    if (oldPassword) {
      const user = await this.repository.findByIdWithPassword(userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (!isValidPassword(oldPassword, user.password)) {
        throw new Error("La contraseña actual es incorrecta");
      }

      if (isValidPassword(newPassword, user.password)) {
        throw new Error("La nueva contraseña no puede ser igual a la anterior");
      }
    }

    const hashedPassword = createHash(newPassword);
    await this.repository.updatePassword(userId, hashedPassword);

    return { message: "Contraseña actualizada exitosamente" };
  }

  async requestPasswordReset(email) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error(
        "Si el email existe, recibirás un correo con instrucciones",
      );
    }

    const resetToken = generateResetToken(user._id.toString(), user.email);

    await EmailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.first_name,
    );

    return {
      message:
        "Si el email existe, recibirás un correo con instrucciones para restablecer tu contraseña",
    };
  }

  async resetPassword(token, newPassword) {
    const decoded = verifyResetToken(token);

    if (!decoded) {
      throw new Error("El enlace de recuperación es inválido o ha expirado");
    }

    const user = await this.repository.findByIdWithPassword(decoded.id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (isValidPassword(newPassword, user.password)) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    const hashedPassword = createHash(newPassword);
    await this.repository.updatePassword(user._id, hashedPassword);

    return { message: "Contraseña restablecida exitosamente" };
  }
}

export default new UserService();
