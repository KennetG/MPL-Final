const CategoriaTienda = require("../models/categoriaTienda");

module.exports.index = async (req, res) => {
  const categorias = await CategoriaTienda.find({}).sort({ nombre: 1 });
  res.render("categoriasTiendaAdmin/index", { categorias });
};

module.exports.guardarCategoria = async (req, res, next) => {
  const categoria = new CategoriaTienda(req.body.categoria);
  await categoria.save();
  res.redirect("/categoriasTienda");
};

module.exports.renderEditarCategoria = async (req, res) => {
  const categoria = await CategoriaTienda.findById(req.params.id);
  res.render("categoriasTiendaAdmin/editar", { categoria });
};

module.exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  await CategoriaTienda.findByIdAndUpdate(id, { ...req.body.categoria });
  res.redirect("/categoriasTienda");
};

module.exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  await CategoriaTienda.findByIdAndDelete(id);
  res.redirect("/categoriasTienda");
};
