const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/usuario");
const { isLoggedIn } = require("../middleware");

router.get("/register", isLoggedIn, (req, res) => {
  res.render("usuarios/register");
});

router.get("/usuarios", isLoggedIn, async (req, res) => {
  const usuarios = await User.find({ _id: { $ne: "60ddfef02865573b4c7b7d72" } }).sort({ nombre: 1 });
  res.render("usuarios/usuarios", { usuarios });
});

router.delete("/usuarios/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  req.flash("success", "Usuario Eliminado.");
  res.redirect("/usuarios");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Bienvenido a MPL, ${username}`);
        res.redirect("/admin");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("usuarios/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", `Bienvenido ${req.user.username}.`);
  const redirectUrl = req.session.returnTo || "/admin";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Sesión terminada.");
  res.redirect("/login");
});

module.exports = router;
