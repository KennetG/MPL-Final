const Producto = require("../models/producto");
const Categoria = require("../models/categoriaTienda");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const productos = await Producto.find({}).sort({ fecha: 1 }).populate("categoriaTienda");
  res.render("productosAdmin/index", { productos });
};

module.exports.renderNuevoProducto = async (req, res) => {
  const categorias = await Categoria.find({}).sort({ nombre: 1 });
  res.render("productosAdmin/nuevo", { categorias });
};

module.exports.guardarProducto = async (req, res, next) => {
  const producto = new Producto(req.body.producto);
  producto.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  producto.modificadoPor = req.user._id;
  await producto.save();
  req.flash("success", "Producto agregado.");
  res.redirect("/productos");
};

module.exports.renderDetalleProducto = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    req.flash("error", "No existe ese producto.");
    return res.redirect("/productos");
  }
  const producto = await Producto.findById(req.params.id).populate("categoriaTienda").populate("modificadoPor");
  if (!producto) {
    req.flash("error", "No existe ese producto.");
    return res.redirect("/productos");
  }
  res.render("productosAdmin/detalle", { producto });
};

module.exports.renderEditarProducto = async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  const categorias = await Categoria.find({}).sort({ nombre: 1 });
  res.render("productosAdmin/editar", { producto, categorias });
};

module.exports.editarProducto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(id, { ...req.body.producto });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  producto.images.push(...imgs);
  producto.modificadoPor = req.user._id;
  await producto.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await producto.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Cambios guardados.");
  res.redirect(`/productos`);
};

module.exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndDelete(id);
  req.flash("success", "Producto Eliminado.");
  res.redirect(`/productos`);
};
