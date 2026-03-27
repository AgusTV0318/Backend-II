# 🛒 E-Commerce de TVs - Sistema Completo

E-commerce profesional de televisores con autenticación JWT, sistema de tickets, recuperación de contraseña y arquitectura en capas.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v4.18+-blue.svg)](https://expressjs.com/)

---

## Características

### Arquitectura Profesional

- ✅ **Patrón Repository** - Separación de lógica de acceso a datos
- ✅ **DAO (Data Access Object)** - Encapsulación de operaciones de BD
- ✅ **Service Layer** - Lógica de negocio centralizada
- ✅ **DTO (Data Transfer Object)** - Transformación segura de datos
- ✅ **Middlewares** - Autenticación y autorización por roles

### Funcionalidades Principales

- 🔐 **Autenticación JWT** - Login seguro con tokens
- 👥 **CRUD de Usuarios** - Gestión completa de usuarios
- 🔑 **Recuperación de Contraseña** - Via email con token de 1 hora
- 📺 **Catálogo de Productos** - TVs con filtros y paginación
- 🛒 **Sistema de Carritos** - Gestión de compras
- 🎫 **Sistema de Tickets** - Generación automática de comprobantes
- 📧 **Emails Profesionales** - Templates HTML con Nodemailer
- 🔒 **Seguridad** - Contraseñas hasheadas con bcrypt

---

## 🏗️ Arquitectura del Sistema

┌─────────────┐
│ Cliente │
└──────┬──────┘
│
▼
┌─────────────┐
│ Routes │ ← Definición de endpoints
└──────┬──────┘
│
▼
┌─────────────┐
│ Controllers │ ← Manejo de HTTP (request/response)
└──────┬──────┘
│
▼
┌─────────────┐
│ Services │ ← Lógica de negocio
└──────┬──────┘
│
▼
┌─────────────┐
│Repositories │ ← Abstracción de datos
└──────┬──────┘
│
▼
┌─────────────┐
│ DAOs │ ← Operaciones de base de datos
└──────┬──────┘
│
▼
┌─────────────┐
│ MongoDB │
└─────────────┘
┌──────────┐
│ DTOs │ ← Transformación de datos
└──────────┘

---

## 🚀 Instalación

### Requisitos Previos

- Node.js v18 o superior
- MongoDB v7.0 o superior
- npm o yarn

### Paso 1: Clonar el repositorio

\`\`\`bash
git clone <tu-repositorio>
cd ecommerce-tvs
\`\`\`

### Paso 2: Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### Paso 3: Configurar variables de entorno

\`\`\`bash
cp .env.example .env

# Editar .env con tus configuraciones

\`\`\`

**Variables importantes:**

- `MONGODB_URI` - Tu conexión a MongoDB
- `JWT_SECRET` - Clave secreta para JWT
- `MAIL_SERVICE` - Configuración de email (gmail o ethereal)

### Paso 4: Poblar base de datos (opcional pero recomendado)

\`\`\`bash
npm run seed
\`\`\`

Esto creará:

- 12 productos (TVs)
- 5 usuarios (1 admin, 2 users, 2 premium)
- Carritos asociados

### Paso 5: Iniciar el servidor

\`\`\`bash

# Modo desarrollo (con nodemon)

npm run dev

# Modo producción

npm start
\`\`\`

El servidor estará en: `http://localhost:8080`

---

## 📡 Endpoints Principales

### Autenticación

| Método | Endpoint                 | Descripción       | Auth |
| ------ | ------------------------ | ----------------- | ---- |
| POST   | `/api/sessions/register` | Registrar usuario | No   |
| POST   | `/api/sessions/login`    | Iniciar sesión    | No   |
| GET    | `/api/sessions/current`  | Usuario actual    | JWT  |
| POST   | `/api/sessions/logout`   | Cerrar sesión     | No   |

### Usuarios

| Método | Endpoint         | Descripción     | Auth | Rol   |
| ------ | ---------------- | --------------- | ---- | ----- |
| GET    | `/api/users`     | Listar usuarios | JWT  | admin |
| GET    | `/api/users/:id` | Ver usuario     | JWT  | todos |
| POST   | `/api/users`     | Crear usuario   | JWT  | admin |
| PUT    | `/api/users/:id` | Actualizar      | JWT  | todos |
| DELETE | `/api/users/:id` | Eliminar        | JWT  | admin |

### Productos

| Método | Endpoint            | Descripción      | Auth | Rol   |
| ------ | ------------------- | ---------------- | ---- | ----- |
| GET    | `/api/products`     | Listar productos | No   | -     |
| GET    | `/api/products/:id` | Ver producto     | No   | -     |
| POST   | `/api/products`     | Crear producto   | JWT  | admin |
| PUT    | `/api/products/:id` | Actualizar       | JWT  | admin |
| DELETE | `/api/products/:id` | Eliminar         | JWT  | admin |

### Carritos

| Método | Endpoint                        | Descripción         | Auth |
| ------ | ------------------------------- | ------------------- | ---- |
| GET    | `/api/carts/:id`                | Ver carrito         | JWT  |
| POST   | `/api/carts/:cid/products/:pid` | Agregar producto    | JWT  |
| PUT    | `/api/carts/:cid/products/:pid` | Actualizar cantidad | JWT  |
| DELETE | `/api/carts/:cid/products/:pid` | Quitar producto     | JWT  |

### Tickets (Compras)

| Método | Endpoint                  | Descripción     | Auth |
| ------ | ------------------------- | --------------- | ---- |
| POST   | `/api/tickets/purchase`   | Procesar compra | JWT  |
| GET    | `/api/tickets/my-tickets` | Mis tickets     | JWT  |
| GET    | `/api/tickets/:id`        | Ver ticket      | JWT  |

### Recuperación de Contraseña

| Método | Endpoint                      | Descripción     | Auth |
| ------ | ----------------------------- | --------------- | ---- |
| POST   | `/api/password-reset/request` | Solicitar reset | No   |
| POST   | `/api/password-reset/reset`   | Restablecer     | No   |

---

## 🧪 Ejemplos de Uso

### Registrar Usuario

\`\`\`bash
curl -X POST http://localhost:8080/api/sessions/register \\
-H "Content-Type: application/json" \\
-d '{
"first_name": "Test",
"last_name": "User",
"email": "test@example.com",
"age": 25,
"password": "password123"
}'
\`\`\`

### Login

\`\`\`bash
curl -X POST http://localhost:8080/api/sessions/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "test@example.com",
"password": "password123"
}'
\`\`\`

### Usuario Actual (con token)

\`\`\`bash
curl -X GET http://localhost:8080/api/sessions/current \\
-H "Authorization: Bearer <tu-token>"
\`\`\`

### Procesar Compra

\`\`\`bash
curl -X POST http://localhost:8080/api/tickets/purchase \\
-H "Authorization: Bearer <tu-token>"
\`\`\`

---

## 🔑 Credenciales de Prueba

Después de ejecutar `npm run seed`:

**Administrador:**

- Email: `admin@ecommerce.com`
- Password: `admin123`

**Usuario Normal:**

- Email: `juan@example.com`
- Password: `password123`

**Usuario Premium:**

- Email: `maria@example.com`
- Password: `password123`

---

## 📁 Estructura del Proyecto

\`\`\`
ecommerce-tvs/
├── src/
│ ├── config/ # Configuraciones (DB, Passport, Email)
│ ├── dao/ # Data Access Objects
│ ├── dto/ # Data Transfer Objects
│ ├── repositories/ # Patrón Repository
│ ├── services/ # Lógica de negocio
│ ├── controllers/ # Controladores HTTP
│ ├── middlewares/ # Middlewares (auth, etc.)
│ ├── models/ # Modelos Mongoose
│ ├── routes/ # Definición de rutas
│ ├── utils/ # Utilidades (bcrypt, JWT)
│ └── app.js # Aplicación principal
├── scripts/
│ └── seed.js # Script de datos de prueba
├── .env.example # Variables de entorno ejemplo
├── .gitignore
├── package.json
└── README.md
\`\`\`

---

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración configurable
- ✅ HttpOnly cookies para tokens
- ✅ DTOs para evitar exposición de datos sensibles
- ✅ Validación de inputs
- ✅ Autorización por roles
- ✅ Tokens de reset con expiración de 1 hora

---

## 🧰 Tecnologías Utilizadas

- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB, Mongoose
- **Autenticación:** Passport.js, JWT
- **Seguridad:** Bcrypt
- **Email:** Nodemailer
- **Otros:** UUID, dotenv, cookie-parser

---

## 📝 Scripts Disponibles

\`\`\`bash
npm start # Iniciar en producción
npm run dev # Iniciar en desarrollo (nodemon)
npm run seed # Poblar base de datos
\`\`\`

---

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Pull Request

---
