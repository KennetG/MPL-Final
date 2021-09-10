const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriasSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
  },
  {
    collection: "categorias",
  }
);

module.exports = mongoose.model("Categoria", categoriasSchema);
