const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    telefono1: {
      type: String,
      required: true,
    },
    telefono2: {
      type: String,
      default: null,
    },
    direccion1: {
      type: String,
    },
    direccion2: {
      type: String,
    },
    tipo: {
      type: String,
      required: true,
      enum: ["Cliente", "Proveedor"],
    },
    empresa: {
      type: String,
    },
    modificadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    collection: "contactos",
  }
);

module.exports = mongoose.model("Contacto", contactosSchema);
