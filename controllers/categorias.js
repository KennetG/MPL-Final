const Categoria = require("../models/categoria");

module.exports.index = async (req, res) => {
  const categorias = await Categoria.find({}).sort({ nombre: 1 });
  res.render("categoriasAdmin/index", { categorias });
};

module.exports.guardarCategoria = async (req, res, next) => {
  const categoria = new Categoria(req.body.categoria);
  await categoria.save();
  res.redirect("/categorias");
};

module.exports.renderEditarCategoria = async (req, res) => {
  const categoria = await Categoria.findById(req.params.id);
  res.render("categoriasAdmin/editar", { categoria });
};

module.exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  await Categoria.findByIdAndUpdate(id, { ...req.body.categoria });
  res.redirect("/categorias");
};

module.exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  await Categoria.findByIdAndDelete(id);
  res.redirect("/categorias");
};
