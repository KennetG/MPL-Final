const express = require("express");
const router = express.Router();
const contactos = require('../controllers/contactos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateContacto } = require('../middleware');

router.route('/')
  .get(isLoggedIn, catchAsync(contactos.index))
  .post(isLoggedIn, validateContacto, catchAsync(contactos.guardarContacto));

router.route("/nuevo").get(isLoggedIn, catchAsync(contactos.renderNuevoContacto));

router.route('/:id')
  .put(isLoggedIn, validateContacto, catchAsync(contactos.editarContacto))
  .delete(isLoggedIn, catchAsync(contactos.eliminarContacto))

router.route('/:id/editar')
  .get(isLoggedIn, catchAsync(contactos.renderEditarContacto))

router.route('/:id/detalle')
  .get(isLoggedIn, catchAsync(contactos.renderDetalleContacto))

module.exports = router;
