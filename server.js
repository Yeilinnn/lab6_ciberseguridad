"use strict";

// Cargar variables de entorno
require('dotenv').config();

// Imports
const express = require("express");
const { auth, requiresAuth } = require('express-openid-connect');
var cons = require('consolidate');
var path = require('path');
let app = express();

// Variables de entorno
const PORT = process.env.PORT || "3000";

// Configuración de Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// MVC View Setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// App middleware
app.use("/static", express.static("static"));

// App routes
app.get("/", (req, res) => {
  res.render("index");  
});

app.get("/dashboard", requiresAuth(), (req, res) => {  
  res.render("dashboard", { user: req.oidc.user });
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});