const express = require("express");
const router = express.Router();
const productos = require("../controllers/productos");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateProducto } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
  .get(isLoggedIn, catchAsync(productos.index))
  .post(isLoggedIn, upload.array("image"), validateProducto, catchAsync(productos.guardarProducto));

router.route("/nuevo").get(isLoggedIn, catchAsync(productos.renderNuevoProducto));

router
  .route("/:id")
  .get(catchAsync(productos.mostrarProducto))
  .put(isLoggedIn, upload.array("image"), validateProducto, catchAsync(productos.editarProducto))
  .delete(isLoggedIn, catchAsync(productos.eliminarProducto));

router.route("/:id/editar")
  .get(isLoggedIn, catchAsync(productos.renderEditarProducto));

router.route("/:id/detalle")
  .get(isLoggedIn, catchAsync(productos.renderDetalleProducto));

module.exports = router;
