const ExpressError = require("./utils/ExpressError");
const { categoriaSchema, proyectoSchema, contactoSchema, productoSchema, cotizacionSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Debe iniciar sesión.");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCategoria = (req, res, next) => {
  const { error } = categoriaSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateProyecto = (req, res, next) => {
  const { error } = proyectoSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateContacto = (req, res, next) => {
  const { error } = contactoSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateProducto = (req, res, next) => {
  const { error } = productoSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCotizacion = (req, res, next) => {
  const { error } = cotizacionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
