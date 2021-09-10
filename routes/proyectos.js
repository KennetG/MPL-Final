const express = require("express");
const router = express.Router();
const proyectos = require("../controllers/proyectos");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateProyecto } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
  .get(isLoggedIn, catchAsync(proyectos.index))
  .post(isLoggedIn, upload.array("image"), validateProyecto, catchAsync(proyectos.guardarProyecto));

router.route("/nuevo").get(isLoggedIn, catchAsync(proyectos.renderNuevoProyecto));

router
  .route("/:id")
  .get(catchAsync(proyectos.mostrarProyecto))
  .put(isLoggedIn, upload.array("image"), validateProyecto, catchAsync(proyectos.editarProyecto))
  .delete(isLoggedIn, catchAsync(proyectos.eliminarProyecto));

router.route("/:id/editar")
  .get(isLoggedIn, catchAsync(proyectos.renderEditarProyecto));

router.route("/:id/detalle")
  .get(isLoggedIn, catchAsync(proyectos.renderDetalleProyecto));

module.exports = router;
