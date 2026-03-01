import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_default";

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name, age, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: "El email ya está registrado" });
        }

        if (!first_name || !last_name || !age) {
          return done(null, false, { message: "Faltan campos obligatorios" });
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

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).populate("cart");

        if (!user) {
          return done(null, false, { message: "Credenciales inválidas" });
        }

        if (!isValidPassword(password, user.password)) {
          return done(null, false, { message: "Credenciales inválidas" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).populate("cart");

        if (!user) {
          return done(null, false, { message: "Token inválido" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  "current",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id)
          .select("-password")
          .populate({
            path: "cart",
            populate: {
              path: "products.product",
            },
          });

        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
