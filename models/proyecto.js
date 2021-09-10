const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_75,h_100,c_scale");
});

const opts = { toJSON: { virtuals: true } };

const proyectosSchema = new Schema(
  {
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
    },
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    images: [ImageSchema],
    fecha: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      message: "El estado deber ser Activo o Inactivo",
      required: true,
      default: "Activo",
    },
    modificadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    collection: "proyectos",
  },
  opts
);

proyectosSchema.post("findOneAndDelete", async function (doc) {
  if (doc.images) {
    for (const img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model("Proyecto", proyectosSchema);
