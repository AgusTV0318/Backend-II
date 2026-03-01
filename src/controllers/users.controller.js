import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import { createHash } from "../utils/bcrypt.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("cart");

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

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "cart",
        populate: {
          path: "products.product",
        },
      });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El email ya está registrado",
      });
    }

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios",
      });
    }

    const newCart = await Cart.create({ products: [] });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: role || "user",
    });

    newCart.user = newUser._id;
    await newCart.save();

    const userResponse = await User.findById(newUser._id)
      .select("-password")
      .populate("cart");

    res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.cart;

    if (updates.password) {
      updates.password = createHash(updates.password);
    }

    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.stauts(400).json({
          status: "error",
          message: "El email ya está en uso",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("cart");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Usuario actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart);
    }

    await User.findByIdAndDelete(id);

    res.json({
      status: "success",
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.stauts(500).json({
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

    if (!["user", "admin", "premium"].includes(role)) {
      return res.status(400).json({
        status: "error",
        message: "Rol inválido. Debe ser: user, admin o premium",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    )
      .select("-password")
      .populate("cart");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Rol actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al cambiar rol",
      error: error.message,
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
