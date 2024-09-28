const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const config = require("./config.json");
const express = require("express");
const generateBasicCRUD = require("./helpers/generateBasicCRUD");

const db = require("./models")(Sequelize, config);

const app = express();

app.use(express.json());

app.get("/api/turtles", async ({ query: { id } }, res) => {
  const findConfig = {
    include: [
      {
        model: db.weapons,
        as: "weapon",
      },
      {
        model: db.pizzas,
        as: "firstFavoritePizza",
      },
      {
        model: db.pizzas,
        as: "secondFavoritePizza",
      },
      {
        model: db.colors,
        as: "color",
      },
    ],
  };

  if (id) {
    findConfig.where = { id };
  }

  try {
    const turtle = await db.turtles[!id ? "findAll" : "findOne"](findConfig);

    res.json(turtle || {});
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

app.get("/api/turtles/pizza/:name", async ({ params: { name } }, res) => {
  const pizza = await db.pizzas.findOne({
    where: {
      name,
    },
  });

  if (!pizza) {
    res.status(400).json({ message: `no pizza with name ${name}` });
  }

  const turtle = await db.turtles.findAll({
    where: {
      [Op.or]: [
        { firstFavoritePizzaId: pizza.id },
        { secondFavoritePizzaId: pizza.id },
      ],
    },
  });

  res.json(turtle);
});

const routers = {
  pizzas: generateBasicCRUD(db.pizzas),
  weapons: generateBasicCRUD(db.weapons),
  colors: generateBasicCRUD(db.colors),
};

Object.entries(routers).forEach(([path, router]) => {
  app.use(`/api/${path}`, router);
});

// force: true => сносит все данные
db.sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log("server started"));
});
