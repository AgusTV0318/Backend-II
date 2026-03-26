import passport from "passport";

export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error en la autenticación",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Token inválido o expirado",
        error: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado",
        error: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para acceder a este recurso",
        error: "Forbidden",
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

export const authenticateCurrent = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error en la autenticación",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Token inválido o no proporcionado",
        error: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const onlyAdminCanManageProducts = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Debes iniciar sesión para realizar esta acción",
      error: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message:
        "Solo los administradores pueden crear, actualizar o eliminar productos",
      error: "Forbidden",
      userRole: req.user.role,
    });
  }

  next();
};

export const onlyUserCanAddToCart = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Debes iniciar sesión para agregar productos al carrito",
      error: "Unauthorized",
    });
  }

  if (!["user", "premium"].includes(req.user.role)) {
    return res.status(403).json({
      status: "error",
      message: "Solo los usuarios pueden agregar productos al carrito",
      error: "Forbidden",
      userRole: req.user.role,
    });
  }

  next();
};

export const verifyCartOwnership = async (req, res, next) => {
  const { cid } = req.params;

  if (req.user.cart.toString() !== cid) {
    return res.status(403).json({
      status: "error",
      message: "No puedes modificar un carrito que no te pertenece",
      error: "Forbidden",
    });
  }

  next();
};

export default {
  authenticateJWT,
  authorize,
  authenticateCurrent,
  onlyAdminCanManageProducts,
  onlyUserCanAddToCart,
  verifyCartOwnership,
};
