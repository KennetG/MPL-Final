const Contacto = require("../models/contacto");

module.exports.index = async (req, res) => {
  const contactos = await Contacto.find({}).sort({ nombre: 1 });
  res.render("contactosAdmin/index", { contactos });
};

module.exports.renderNuevoContacto = async (req, res) => {
  const contacto = await Contacto.findById(req.params.id);
  res.render("contactosAdmin/nuevo", { contacto });
};

module.exports.guardarContacto = async (req, res, next) => {
  const contacto = new Contacto(req.body.contacto);
  contacto.modificadoPor = req.user._id;
  await contacto.save();
  res.redirect("/contactos");
};

module.exports.renderEditarContacto = async (req, res) => {
  const contacto = await Contacto.findById(req.params.id);
  res.render("contactosAdmin/editar", { contacto });
};

module.exports.editarContacto = async (req, res) => {
  const { id } = req.params;
  const contacto = await Contacto.findByIdAndUpdate(id, { ...req.body.contacto });
  contacto.modificadoPor = req.user._id;
  await contacto.save();
  res.redirect("/contactos");
};

module.exports.eliminarContacto = async (req, res) => {
  const { id } = req.params;
  await Contacto.findByIdAndDelete(id);
  res.redirect("/contactos");
};

module.exports.renderDetalleContacto = async (req, res) => {
  const contacto = await Contacto.findById(req.params.id).populate("modificadoPor");
  res.render("contactosAdmin/detalle", { contacto });
};
