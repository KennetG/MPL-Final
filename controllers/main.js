const Producto = require("../models/producto");
const Proyecto = require("../models/proyecto");
const Cotizacion = require("../models/cotizacion");

module.exports.index = async (req, res) => {
  const proyectos = await Proyecto.find({ _id: { $in: ["60a2b4f61582cc508c9cf535", "60a2fc86acaf4e1138faf766"] } })
    .sort({ fecha: -1 })
    .populate("categoria");
  res.render("main/index", { proyectos });
};

module.exports.tienda = async (req, res) => {
  const productos = await Producto.find({ estado: "Activo", inventario: { $gte: 1 } })
    .sort({ fecha: 1 })
    .populate("categoriaTienda");
  res.render("main/tienda", { productos });
};

module.exports.trabajos = async (req, res) => {
  const proyectos = await Proyecto.find({ estado: "Activo" }).sort({ fecha: -1 }).populate("categoria");
  res.render("main/trabajos", { proyectos });
};

module.exports.contacto = async (req, res) => {
  res.render("main/contacto");
};

module.exports.cotizar = async (req, res) => {
  res.render("main/cotizar");
};

module.exports.guardarCotizacion = async (req, res) => {
  const cotizacion = new Cotizacion(req.body.cotizacion);
  await cotizacion.save();
  req.flash("success", "Gracias por enviar su solicitud, pronto nos pondremos en contacto.");
  res.redirect("/cotizar");
};

module.exports.acercaDe = async (req, res) => {
  res.render("main/acercaDe");
};
