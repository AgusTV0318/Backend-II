import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config.js";
import connectDB from "./config/database.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import passwordResetRoutes from "./routes/passwordReset.routes.js";
import ticketsRoutes from "./routes/ticket.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/tickets", ticketsRoutes);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    message: "🛒 Bienvenido al E-commerce de TVs",
    version: "1.0.0",
    endpoints: {
      sessions: "/api/sessions",
      users: "/api/users",
      products: "/api/products",
      carts: "/api/carts",
    },
    documentation: {
      register: "POST /api/sessions/register",
      login: "POST /api/sessions/login",
      current: "GET /api/sessions/current ⭐",
      logout: "POST /api/sessions/logout",
    },
  });
});

app.use("/api/sessions", sessionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Modo: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n📚 Endpoints disponibles:`);
  console.log(`   POST   /api/sessions/register - Registrar usuario`);
  console.log(`   POST   /api/sessions/login - Iniciar sesión`);
  console.log(`   GET    /api/sessions/current ⭐ - Usuario actual (JWT)`);
  console.log(`   POST   /api/sessions/logout - Cerrar sesión`);
  console.log(`   GET    /api/users - Listar usuarios (admin)`);
  console.log(`   GET    /api/products - Listar productos`);
  console.log(`   GET    /api/carts/:id - Ver carrito`);
  console.log(`\n✨ ¡Listo para recibir peticiones!\n`);
});

export default app;
