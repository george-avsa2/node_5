const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const config = require("./config.json");
const express = require("express");

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

app.post("/api/turtles", async ({ body }, res) => {
  const turtles = await db.turtles.create(body);
  res.json(turtles);
});

app.post("/api/weapons", async ({ body }, res) => {
  const weapons = await db.weapons.create(body);
  res.json(weapons);
});

app.post("/api/pizzas", async ({ body }, res) => {
  const pizza = await db.pizzas.create(body);
  res.json(pizza);
});

app.post("/api/colors", async ({ body }, res) => {
  try {
    const color = await db.colors.create(body);
    res.json(color);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

app.delete("/api/colors", async ({ body: { id } }, res) => {
  try {
    const color = await db.colors.destroy({
      where: {
        id,
      },
    });
    res.json(color > 0);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

// force: true => сносит все данные
db.sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log("server started"));
});
