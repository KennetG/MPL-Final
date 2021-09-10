const express = require("express");
const router = express.Router();
const main = require("../controllers/main");
const catchAsync = require("../utils/catchAsync");
const { validateCotizacion } = require("../middleware");

router.route("/").get(catchAsync(main.index));

router.route("/tienda").get(catchAsync(main.tienda));

router.route("/trabajos").get(catchAsync(main.trabajos));

router.route("/contacto").get(catchAsync(main.contacto));

router.route("/cotizar").get(catchAsync(main.cotizar)).post(validateCotizacion, catchAsync(main.guardarCotizacion));

router.route("/acercaDe").get(catchAsync(main.acercaDe));

module.exports = router;
