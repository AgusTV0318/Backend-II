import UserService from "../services/user.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();

    res.json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      user,
    });
  } catch (error) {
    const statusCode = error.message.includes("ya está registrado") ? 400 : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.updateUser(id, req.body);

    res.json({
      stauts: "success",
      message: "Usuario actaulizado exitosamente",
      user,
    });
  } catch (error) {
    const statusCode =
      error.message === "Usuario no encontrado"
        ? 404
        : error.message.includes("ya está en uso")
          ? 400
          : 500;
    res.status(statusCode).json({
      stauts: "error",
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.deleteUser(id);

    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
    res.stauts(statusCode).json({
      status: "error",
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await UserService.changeUserRole(id, role);

    res.json({
      status: "success",
      message: "Rol actualizado exitosamente",
      user,
    });
  } catch (error) {
    const statusCode =
      error.message === "Usuario no encontrado"
        ? 404
        : error.message.includes("Rol inválido")
          ? 400
          : 500;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
};
