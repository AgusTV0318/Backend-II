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

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    message: "🛒 Bienvenido al E-commerce de TVs",
    version: "2.0.0",
    description: "API REST profesional con arquitectura en capas",
    architecture: {
      pattern: "Repository + DAO + Service + DTO",
      features: [
        "Autenticación JWT",
        "Autorización por roles",
        "Recuperación de contraseña",
        "Sistema de tickets",
        "DTOs para seguridad",
      ],
    },
    endpoints: {
      sessions: "/api/sessions",
      users: "/api/users",
      products: "/api/products",
      carts: "/api/carts",
      passwordReset: "/api/password-reset",
      tickets: "/api/tickets",
    },
    documentation: {
      auth: {
        register: "POST /api/sessions/register",
        login: "POST /api/sessions/login",
        current: "GET /api/sessions/current (con JWT)",
        logout: "POST /api/sessions/logout",
      },
      passwordReset: {
        request: "POST /api/password-reset/request",
        reset: "POST /api/password-reset/reset",
      },
      purchase: {
        buy: "POST /api/tickets/purchase",
        myTickets: "GET /api/tickets/my-tickets",
      },
    },
    author: "Agustín Vozza",
    course: "Coderhouse Backend II",
  });
});

app.use("/api/sessions", sessionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/tickets", ticketsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
    availableRoutes: [
      "/api/sessions",
      "/api/users",
      "/api/products",
      "/api/carts",
      "/api/password-reset",
      "/api/tickets",
    ],
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
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🚀 SERVIDOR E-COMMERCE TVS INICIADO                  ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  📡 URL: http://localhost:${PORT}                        ║
║  🌍 Modo: ${process.env.NODE_ENV || "development"}                            ║
║  📦 Versión: 2.0.0                                       ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  📚 ENDPOINTS PRINCIPALES:                               ║
║                                                           ║
║  🔐 Autenticación:                                       ║
║     POST   /api/sessions/register                        ║
║     POST   /api/sessions/login                           ║
║     GET    /api/sessions/current                         ║
║                                                           ║
║  👥 Usuarios:                                            ║
║     GET    /api/users (admin)                            ║
║     POST   /api/users (admin)                            ║
║                                                           ║
║  📺 Productos:                                           ║
║     GET    /api/products                                 ║
║     POST   /api/products (admin)                         ║
║                                                           ║
║  🛒 Carritos:                                            ║
║     POST   /api/carts/:cid/products/:pid                 ║
║                                                           ║
║  🎫 Tickets:                                             ║
║     POST   /api/tickets/purchase                         ║
║     GET    /api/tickets/my-tickets                       ║
║                                                           ║
║  📧 Recuperación:                                        ║
║     POST   /api/password-reset/request                   ║
║     POST   /api/password-reset/reset                     ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ✨ ¡Sistema listo para recibir peticiones!             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
