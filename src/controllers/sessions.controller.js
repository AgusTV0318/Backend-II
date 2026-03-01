import passport from "passport";
import { generateToken } from "../utils/jwt.js";

export const register = (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error en el registro",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: info?.message || "Error en el registro",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      max: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.email,
        role: user.role,
        cart: user.cart,
      },
    });
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error en el login",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Credenciales inválidas",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      },
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    status: "success",
    message: "Logout exitoso",
  });
};

export const current = (req, res) => {
  res.json({
    status: "success",
    message: "Usuario autenticado",
    user: {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
};

export default {
  register,
  login,
  logout,
  current,
};
