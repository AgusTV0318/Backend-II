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
    description:
      "Televisor QLED con tecnología Quantum Dot para colores vibrantes y realistas. Smart TV con Tizen OS.",
    code: "SAM-QLED-55",
    price: 899.99,
    stock: 25,
    category: "QLED",
    brand: "Samsung",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.samsung.com/qled-55.jpg"],
  },
  {
    title: 'LG OLED 65" 4K',
    description:
      "Televisor OLED con negros perfectos y HDR Dolby Vision. Procesador α9 Gen 6 AI.",
    code: "LG-OLED-65",
    price: 1599.99,
    stock: 15,
    category: "OLED",
    brand: "LG",
    size: "65 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.lg.com/oled-65.jpg"],
  },
  {
    title: 'Sony Bravia 55" 4K LED',
    description:
      "Smart TV con Android TV y procesador X1 para calidad de imagen superior.",
    code: "SONY-LED-55",
    price: 749.99,
    stock: 30,
    category: "LED",
    brand: "Sony",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.sony.com/bravia-55.jpg"],
  },
  {
    title: 'TCL 43" Smart TV',
    description: "Smart TV económico con Roku TV integrado y HDR10.",
    code: "TCL-SMART-43",
    price: 299.99,
    stock: 50,
    category: "Smart TV",
    brand: "TCL",
    size: "43 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.tcl.com/smart-43.jpg"],
  },
  {
    title: 'Samsung The Frame 55"',
    description: "TV que se convierte en arte cuando está apagado. QLED 4K.",
    code: "SAM-FRAME-55",
    price: 1299.99,
    stock: 10,
    category: "QLED",
    brand: "Samsung",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.samsung.com/frame-55.jpg"],
  },
  {
    title: 'LG NanoCell 65" 4K',
    description:
      "Tecnología NanoCell para colores puros desde cualquier ángulo.",
    code: "LG-NANO-65",
    price: 999.99,
    stock: 20,
    category: "4K",
    brand: "LG",
    size: "65 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.lg.com/nano-65.jpg"],
  },
  {
    title: 'Sony A95K OLED 65" 4K',
    description: "OLED QD de última generación con brillo excepcional.",
    code: "SONY-OLED-65",
    price: 2499.99,
    stock: 8,
    category: "OLED",
    brand: "Sony",
    size: "65 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.sony.com/a95k-65.jpg"],
  },
  {
    title: 'Samsung Neo QLED 8K 75"',
    description: "Resolución 8K con Quantum Matrix Technology.",
    code: "SAM-8K-75",
    price: 3999.99,
    stock: 5,
    category: "8K",
    brand: "Samsung",
    size: "75 pulgadas",
    resolution: "8K",
    thumbnails: ["https://images.samsung.com/8k-75.jpg"],
  },
  {
    title: 'Hisense U8H 65" ULED',
    description: "ULED con Mini-LED y Dolby Vision IQ.",
    code: "HIS-ULED-65",
    price: 1099.99,
    stock: 18,
    category: "4K",
    brand: "Hisense",
    size: "65 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.hisense.com/u8h-65.jpg"],
  },
  {
    title: 'Philips OLED 55" Ambilight',
    description: "OLED con tecnología Ambilight para inmersión total.",
    code: "PHI-OLED-55",
    price: 1399.99,
    stock: 12,
    category: "OLED",
    brand: "Philips",
    size: "55 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.philips.com/oled-55.jpg"],
  },
  {
    title: 'Xiaomi TV P1 43"',
    description: "Android TV económico con excelente relación calidad-precio.",
    code: "XIA-P1-43",
    price: 349.99,
    stock: 40,
    category: "Smart TV",
    brand: "Xiaomi",
    size: "43 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.xiaomi.com/p1-43.jpg"],
  },
  {
    title: 'LG C3 OLED 77" 4K',
    description: "OLED de gran tamaño ideal para home theater.",
    code: "LG-C3-77",
    price: 3299.99,
    stock: 6,
    category: "OLED",
    brand: "LG",
    size: "77 pulgadas",
    resolution: "4K UHD",
    thumbnails: ["https://images.lg.com/c3-77.jpg"],
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

    console.log("🗑️  Limpiando colecciones existentes...");
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

    console.log("🛒 Agregando productos a carritos de prueba...");
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
    console.log("✅ Productos agregados al carrito de Juan\n");

    console.log(
      "╔═══════════════════════════════════════════════════════════╗",
    );
    console.log(
      "║                                                           ║",
    );
    console.log("║     📊 RESUMEN DE DATOS CREADOS                          ║");
    console.log(
      "║                                                           ║",
    );
    console.log(
      "╠═══════════════════════════════════════════════════════════╣",
    );
    console.log(`║  📺 Productos: ${products.length.toString().padEnd(43)} ║`);
    console.log(`║  👥 Usuarios: ${usersData.length.toString().padEnd(44)} ║`);
    console.log(`║  🛒 Carritos: ${usersData.length.toString().padEnd(44)} ║`);
    console.log(
      "╠═══════════════════════════════════════════════════════════╣",
    );
    console.log(
      "║                                                           ║",
    );
    console.log("║  🔑 CREDENCIALES DE ACCESO                               ║");
    console.log(
      "║                                                           ║",
    );
    console.log(
      "╠═══════════════════════════════════════════════════════════╣",
    );
    console.log(
      "║                                                           ║",
    );
    console.log("║  👑 Administrador:                                       ║");
    console.log("║     Email: admin@ecommerce.com                           ║");
    console.log("║     Password: admin123                                   ║");
    console.log("║     Permisos: Acceso total                               ║");
    console.log(
      "║                                                           ║",
    );
    console.log("║  👤 Usuario Normal:                                      ║");
    console.log("║     Email: juan@example.com                              ║");
    console.log("║     Password: password123                                ║");
    console.log("║     Carrito: Con 3 productos                             ║");
    console.log(
      "║                                                           ║",
    );
    console.log("║  ⭐ Usuario Premium:                                     ║");
    console.log("║     Email: maria@example.com                             ║");
    console.log("║     Password: password123                                ║");
    console.log(
      "║                                                           ║",
    );
    console.log(
      "╠═══════════════════════════════════════════════════════════╣",
    );
    console.log(
      "║                                                           ║",
    );
    console.log("║  ✨ Seed completado exitosamente!                        ║");
    console.log("║  🚀 Inicia el servidor: npm run dev                      ║");
    console.log(
      "║                                                           ║",
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n",
    );
  } catch (error) {
    console.error("❌ Error en el seed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
    process.exit(0);
  }
};

seedDatabase();
