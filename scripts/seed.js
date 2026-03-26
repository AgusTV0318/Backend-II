import mongoose from "mongoose";
import dotenv from "dotenv";
import { createHash } from "../src/utils/bcrypt.js";
import User from "../src/models/User.model.js";
import Cart from "../src/models/Cart.model.js";
import Product from "../src/models/Product.model.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ecommerce:Backend2@cluster0.j5c3nuy.mongodb.net/?appName=Cluster0";

const productsData = [
  {
    title: 'Samsung QLED 55" 4K',
    description: "Televisor QLED con tecnología Quantum Dot",
    code: "SAM-QLED-55",
    price: 899.99,
    stock: 25,
    category: "QLED",
    brand: "Samsung",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://example.com/samsung-qled-55.jpg"],
  },
  {
    title: 'LG OLED 65" 4K',
    description: "Televisor OLED con negros perfectos",
    code: "LG-OLED-65",
    price: 1599.99,
    stock: 15,
    category: "OLED",
    brand: "LG",
    size: "65 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://example.com/lg-oled-65.jpg"],
  },
  {
    title: 'Sony Bravia 55" 4K LED',
    description: "Smart TV con Android TV",
    code: "SONY-LED-55",
    price: 749.99,
    stock: 30,
    category: "LED",
    brand: "Sony",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://example.com/sony-bravia-55.jpg"],
  },
  {
    title: 'TCL 43" Smart TV',
    description: "Smart TV económico con Roku",
    code: "TCL-SMART-43",
    price: 299.99,
    stock: 50,
    category: "Smart TV",
    brand: "TCL",
    size: "43 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://example.com/tcl-smart-43.jpg"],
  },
  {
    title: 'Samsung The Frame 55"',
    description: "TV que se convierte en arte",
    code: "SAM-FRAME-55",
    price: 1299.99,
    stock: 10,
    category: "QLED",
    brand: "Samsung",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://example.com/samsung-frame-55.jpg"],
  },
];

const usersData = [
  {
    first_name: "Admin",
    last_name: "Principal",
    email: "admin@ecommerce.com",
    age: 30,
    password: "admin123",
    role: "admin",
  },
  {
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan@example.com",
    age: 25,
    password: "password123",
    role: "user",
  },
  {
    first_name: "María",
    last_name: "García",
    email: "maria@example.com",
    age: 28,
    password: "password123",
    role: "premium",
  },
  {
    first_name: "Carlos",
    last_name: "López",
    email: "carlos@example.com",
    age: 35,
    password: "password123",
    role: "user",
  },
  {
    first_name: "Ana",
    last_name: "Martínez",
    email: "ana@example.com",
    age: 27,
    password: "password123",
    role: "premium",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Iniciando seed de la base de datos...\n");

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    console.log("🗑️  Limpiando colecciones...");
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
    console.log("✅ Colecciones limpiadas\n");

    console.log("📺 Creando productos...");
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} productos creados\n`);

    console.log("👥 Creando usuarios con carritos...");
    for (const userData of usersData) {
      const cart = await Cart.create({ products: [] });

      const user = await User.create({
        ...userData,
        password: createHash(userData.password),
        cart: cart._id,
      });

      cart.user = user._id;
      await cart.save();

      console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
    }
    console.log("");

    console.log("🛒 Agregando productos al carrito de prueba...");
    const normalUser = await User.findOne({ email: "juan@example.com" });
    const userCart = await Cart.findById(normalUser.cart);

    userCart.products.push({
      product: products[0]._id,
      quantity: 1,
    });
    userCart.products.push({
      product: products[2]._id,
      quantity: 2,
    });
    userCart.products.push({
      product: products[5]._id,
      quantity: 1,
    });
    await userCart.save();
    console.log("✅ Productos agregados\n");

    console.log("📊 RESUMEN:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📺 Productos: ${products.length}`);
    console.log(`👥 Usuarios: ${usersData.length}`);
    console.log(`🛒 Carritos: ${usersData.length}`);
    console.log("");

    console.log("🔑 CREDENCIALES:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 Admin:");
    console.log("   Email: admin@ecommerce.com");
    console.log("   Password: admin123");
    console.log("");
    console.log("👤 Usuario Normal:");
    console.log("   Email: juan@example.com");
    console.log("   Password: password123");
    console.log("");
    console.log("⭐ Usuario Premium:");
    console.log("   Email: maria@example.com");
    console.log("   Password: password123");
    console.log("");

    console.log("✨ Seed completado!\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
    process.exit(0);
  }
};

seedDatabase();
