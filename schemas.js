const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.categoriaSchema = Joi.object({
  categoria: Joi.object({
    nombre: Joi.string().required(),
  }).required(),
});

module.exports.categoriaTiendaSchema = Joi.object({
  categoria: Joi.object({
    nombre: Joi.string().required(),
  }).required(),
});

module.exports.proyectoSchema = Joi.object({
  proyecto: Joi.object({
    categoria: Joi.objectId().required(),
    titulo: Joi.string().required(),
    descripcion: Joi.string().required(),
    tags: Joi.string().required(),
    fecha: Joi.date().required(),
    estado: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.contactoSchema = Joi.object({
  contacto: Joi.object({
    nombre: Joi.string().required(),
    telefono1: Joi.string().required(),
    telefono2: Joi.string().optional().allow(""),
    direccion1: Joi.string().optional().allow(""),
    direccion2: Joi.string().optional().allow(""),
    empresa: Joi.string().optional().allow(""),
    tipo: Joi.string().required(),
  }).required(),
});

module.exports.productoSchema = Joi.object({
  producto: Joi.object({
    categoriaTienda: Joi.objectId().required(),
    titulo: Joi.string().required(),
    descripcion: Joi.string().required(),
    inventario: Joi.number().required(),
    precio: Joi.string().required(),
    estado: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.cotizacionSchema = Joi.object({
  cotizacion: Joi.object({
    nombre: Joi.string().required(),
    telefono: Joi.string().required(),
    direccion: Joi.string().optional().allow(""),
    descripcion: Joi.string().required(),
    detalles: Joi.string().optional().allow(""),
    estado: Joi.string().optional().allow(""),
  }).required(),
});
