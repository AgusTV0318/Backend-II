import UserService from "../services/user.service.js";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "El email es requerido",
      });
    }

    const result = await UserService.requestPasswordReset(email);

    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Token y nueva contraseña son requeridos",
      });
    }

    if (newPassword.length < 6) {
      return (
        res,
        status(400).json({
          status: "error",
          message: "La contraseña debe tenr al menos 6 caracteres",
        })
      );
    }

    const result = await UserService.resetPassword(token, newPassword);

    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    const statusCode =
      error.message.includes("inválido") ||
      error.message.includes("expirado") ||
      error.message.includes("igual")
        ? 400
        : 500;

    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  requestPasswordReset,
  resetPassword,
};
