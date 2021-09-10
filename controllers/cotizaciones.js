const Cotizacion = require("../models/cotizacion");

module.exports.index = async (req, res) => {
  const cotizaciones = await Cotizacion.find({}).sort({ nombre: 1 });
  res.render("cotizacionesAdmin/index", { cotizaciones });
};

module.exports.renderNuevoCotizacion = async (req, res) => {
  const cotizacion = await Cotizacion.findById(req.params.id);
  res.render("cotizacionsAdmin/nuevo", { cotizacion });
};

module.exports.guardarCotizacion = async (req, res, next) => {
  const cotizacion = new Cotizacion(req.body.cotizacion);
  cotizacion.modificadoPor = req.user._id;
  await cotizacion.save();
  res.redirect("/cotizaciones");
};

module.exports.renderEditarCotizacion = async (req, res) => {
  const cotizacion = await Cotizacion.findById(req.params.id);
  res.render("cotizacionesAdmin/editar", { cotizacion });
};

module.exports.editarCotizacion = async (req, res) => {
  const { id } = req.params;
  const cotizacion = await Cotizacion.findByIdAndUpdate(id, { ...req.body.cotizacion });
  cotizacion.modificadoPor = req.user._id;
  await cotizacion.save();
  res.redirect("/cotizaciones");
};

module.exports.eliminarCotizacion = async (req, res) => {
  const { id } = req.params;
  await Cotizacion.findByIdAndDelete(id);
  res.redirect("/cotizaciones");
};

module.exports.renderDetalleCotizacion = async (req, res) => {
  const cotizacion = await Cotizacion.findById(req.params.id).populate("modificadoPor");
  res.render("cotizacionesAdmin/detalle", { cotizacion });
};
