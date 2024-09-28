const Sequelize = require("sequelize");

const config = require("./config.json");
const express = require("express");
const generateBasicCRUD = require("./helpers/generateBasicCRUD");
const getTurtleCRUD = require("./routes/turtles");
const generatePizzaAdditional = require("./routes/pizzas");
const generateWeaponAdditional = require("./routes/weapon");

const db = require("./models")(Sequelize, config);

const app = express();

app.use(express.json());

const routers = {
  turtles: getTurtleCRUD(db),
  pizzas: generatePizzaAdditional(db, generateBasicCRUD(db.pizzas)),
  weapons: generateWeaponAdditional(db, generateBasicCRUD(db.weapons)),
  colors: generateBasicCRUD(db.colors),
};

Object.entries(routers).forEach(([path, router]) => {
  app.use(`/api/${path}`, router);
});

// force: true => сносит все данные
db.sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log("server started"));
});
