if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override"); //Diferentes metodos HTTP
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Usuario = require("./models/usuario");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const { isLoggedIn } = require("./middleware");

const usuarioRutas = require("./routes/usuarios");
const mainRutas = require("./routes/main");
const categoriaRutas = require("./routes/categorias");
const proyectoRutas = require("./routes/proyectos");
const categoriaTiendaRutas = require("./routes/categoriasTienda");
const productoRutas = require("./routes/productos");
const contactoRutas = require("./routes/contactos");
const cotizacionRutas = require("./routes/cotizaciones");

const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/mpl";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected Successfully");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //Leer formatos en métodos POST
app.use(methodOverride("_method")); //Usar methodOverride en toda la aplicación
app.use(express.static(path.join(__dirname, "public"))); //Archivos estaticos de public
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname, "scss"))); //Mi CSS modificado con SASS

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = ["https://cdn.jsdelivr.net", "https://kit-free.fontawesome.com/", "https://stackpath.bootstrapcdn.com/", "https://fonts.googleapis.com/", "https://use.fontawesome.com/"];
const connectSrcUrls = ["https://api.mapbox.com/", "https://a.tiles.mapbox.com/", "https://b.tiles.mapbox.com/", "https://events.mapbox.com/"];
const fontSrcUrls = ["https://cdn.jsdelivr.net", "https://fonts.gstatic.com"];
const frameSrcUrls = ["https://www.google.com/maps/", "charts.mongodb.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      frameSrc: ["'self'", ...frameSrcUrls],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dmi3zyqqf/", //Cloudinary resource URL!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize()); //passport
app.use(passport.session());
passport.use(new LocalStrategy(Usuario.authenticate()));

passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Rutas de Express Router
app.use("/", usuarioRutas);
app.use("/", mainRutas);
app.use("/categorias", categoriaRutas);
app.use("/proyectos", proyectoRutas);
app.use("/categoriasTienda", categoriaTiendaRutas);
app.use("/productos", productoRutas);
app.use("/contactos", contactoRutas);
app.use("/cotizaciones", cotizacionRutas);

app.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin/index");
});

//Error messages

app.all("*", (req, res, next) => {
  next(new ExpressError("La página que busca no existe", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err) err.message = "Algo salió mal.";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Puerto " + port);
});
