const express = require("express");
const router = express.Router();
const cotizaciones = require("../controllers/cotizaciones");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCotizacion } = require("../middleware");

router.route("/")
    .get(isLoggedIn, catchAsync(cotizaciones.index))
    .post(isLoggedIn, validateCotizacion, catchAsync(cotizaciones.guardarCotizacion));

router.route("/nuevo")
    .get(isLoggedIn, catchAsync(cotizaciones.renderNuevoCotizacion));

router.route("/:id")
    .put(isLoggedIn, validateCotizacion, catchAsync(cotizaciones.editarCotizacion))
    .delete(isLoggedIn, catchAsync(cotizaciones.eliminarCotizacion));

router.route("/:id/editar")
    .get(isLoggedIn, catchAsync(cotizaciones.renderEditarCotizacion));

router.route("/:id/detalle")
    .get(isLoggedIn, catchAsync(cotizaciones.renderDetalleCotizacion));

module.exports = router;

module.exports = router;
