const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriasTiendaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
  },
  {
    collection: "categoriasTienda",
  }
);

module.exports = mongoose.model("CategoriaTienda", categoriasTiendaSchema);
