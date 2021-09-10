const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UsuariosSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "usuarios",
  }
);

UsuariosSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Usuario", UsuariosSchema);
