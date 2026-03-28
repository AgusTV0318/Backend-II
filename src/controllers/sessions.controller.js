import UserService from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await UserService.register(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      message: "Login exitoso",
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    status: "success",
    message: "Logout exitoso",
  });
};

export const current = async (req, res) => {
  try {
    const userDTO = await UserService.getCurrentUser(req.user._id);

    res.json({
      status: "success",
      message: "Usuario autenticado",
      user: userDTO,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export default {
  register,
  login,
  logout,
  current,
};
