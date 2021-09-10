const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cotizacionesSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      default: null,
    },
    descripcion: {
      type: String,
      required: true,
    },
    detalles: {
      type: String,
    },
    estado: {
      type: String,
      enum: ["Nuevo", "Pendiente", "En Progreso", "Finalizado"],
      required: true,
      default: "Nuevo",
    },
    modificadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    collection: "cotizaciones",
  }
);

module.exports = mongoose.model("Cotizacion", cotizacionesSchema);
