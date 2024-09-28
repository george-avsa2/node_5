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

  router.get("/api/turtles/pizza/:name", async ({ params: { name } }, res) => {
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

  return router;
}

module.exports = getTurtleCRUD;
