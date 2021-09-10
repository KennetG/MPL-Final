const Proyecto = require("../models/proyecto");
const Categoria = require("../models/categoria");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const proyectos = await Proyecto.find({}).sort({ fecha: 1 }).populate("categoria");
  res.render("proyectosAdmin/index", { proyectos });
};

module.exports.renderNuevoProyecto = async (req, res) => {
  const categorias = await Categoria.find({}).sort({ nombre: 1 });
  res.render("proyectosAdmin/nuevo", { categorias });
};

module.exports.guardarProyecto = async (req, res, next) => {
  const proyecto = new Proyecto(req.body.proyecto);
  proyecto.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  proyecto.modificadoPor = req.user._id;
  await proyecto.save();
  req.flash("success", "Proyecto agregado.");
  res.redirect("/proyectos");
};

module.exports.renderDetalleProyecto = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    req.flash("error", "No existe ese proyecto.");
    return res.redirect("/proyectos");
  }
  const proyecto = await Proyecto.findById(req.params.id).populate("categoria").populate("modificadoPor");
  if (!proyecto) {
    req.flash("error", "No existe ese proyecto.");
    return res.redirect("/proyectos");
  }
  res.render("proyectosAdmin/detalle", { proyecto });
};

module.exports.renderEditarProyecto = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  const categorias = await Categoria.find({}).sort({ nombre: 1 });
  res.render("proyectosAdmin/editar", { proyecto, categorias });
};

module.exports.editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findByIdAndUpdate(id, { ...req.body.proyecto });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  proyecto.images.push(...imgs);
  proyecto.modificadoPor = req.user._id;
  await proyecto.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await proyecto.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Cambios guardados.");
  res.redirect(`/proyectos`);
};

module.exports.eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  await Proyecto.findByIdAndDelete(id);
  req.flash("success", "Proyecto Eliminado.");
  res.redirect(`/proyectos`);
};
