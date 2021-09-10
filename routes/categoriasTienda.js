const express = require("express");
const router = express.Router();
const categorias = require("../controllers/categoriasTienda");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCategoria } = require("../middleware");

router.route("/")
    .get(isLoggedIn, catchAsync(categorias.index))
    .post(isLoggedIn, validateCategoria, catchAsync(categorias.guardarCategoria));

router.route("/:id")
    .put(isLoggedIn, validateCategoria, catchAsync(categorias.editarCategoria))
    .delete(isLoggedIn, catchAsync(categorias.eliminarCategoria));

router.route("/:id/editar")
    .get(isLoggedIn, catchAsync(categorias.renderEditarCategoria));

module.exports = router;
