const express = require("express");
const { Op } = require("sequelize");

function getTurtleCRUD(db) {
  const router = express.Router();

  router.get("/", async ({ query: { id } }, res) => {
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

  router.get("/pizza/:name", async ({ params: { name } }, res) => {
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

  router.post("/", async ({ body }, res) => {
    try {
      const item = await db.turtles.create(body);
      res.json(item);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  router.put("/", async ({ body, query: { id } }, res) => {
    try {
      const item = await db.turtles.update(body, { where: { id } });
      res.json(item[0] > 0);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  router.delete("/", async ({ query: { id } }, res) => {
    try {
      const item = await db.turtles.destroy({
        where: {
          id,
        },
      });
      res.json(item > 0);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  return router;
}

module.exports = getTurtleCRUD;
