import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";

class UserDAO {
  async findByEmail(email) {
    try {
      return await User.findOne({ email }).populate("cart");
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await User.findById(id)
        .select("-password")
        .populate({
          path: "cart",
          populate: {
            path: "products.product",
          },
        });
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  async findByIdWithPassword(id) {
    try {
      return await User.findById(id).populate("cart");
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await User.find().select("-password").populate("cart");
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async create(UserData) {
    try {
      const newCart = await Cart.create({ products: [] });

      const newUser = await User.create({
        ...UserData,
        cart: newCart._id,
      });

      newCart.user = newUser._id;
      await newCart.save();

      return newUser;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async update(id, updates) {
    try {
      return await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })
        .select("-password")
        .populate("cart");
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (user.cart) {
        await Cart.findByIdAndDelete(user.cart);
      }

      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async updatePassword(id, hashedPassword) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }
}

export default new UserDAO();
