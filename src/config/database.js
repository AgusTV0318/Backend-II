import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-tvs";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB conectado exitosamente");
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de conexión de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose desconectado de MongoDB");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 Mongoose desconectado debido a terminación de aplicación");
  process.exit(0);
});

export default connectDB;
