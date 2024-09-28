const { Op } = require("sequelize");

function generatePizzaAdditional(db, router) {
  // понимаю насколько это костыль и высокая сложность, но оно же работает
  // по идее тут нужно все делать через запрос, но пока sql не прокачан до 81 уровня
  router.get("/unique", async (req, res) => {
    const turtles = await db.turtles.findAll();
    const pizzaCounter = turtles.reduce((acc, turtle) => {
      if (turtle.firstFavoritePizzaId) {
        if (acc[turtle.firstFavoritePizzaId]) {
          acc[turtle.firstFavoritePizzaId] += 1;
        } else {
          acc[turtle.firstFavoritePizzaId] = 1;
        }
      }
      if (turtle.secondFavoritePizzaId) {
        if (acc[turtle.secondFavoritePizzaId]) {
          acc[turtle.secondFavoritePizzaId] += 1;
        } else {
          acc[turtle.secondFavoritePizzaId] = 1;
        }
      }

      return acc;
    }, {});

    const ids = Object.entries(pizzaCounter)
      .filter(([_, count]) => count === 1)
      .map(([id, _]) => id);

    if (ids.length) {
      const pizzas = await db.pizzas.findAll({
        where: {
          [Op.or]: ids.map((id) => ({ id })),
        },
      });
      res.json(pizzas);
    } else {
      res.json({ message: "no unique" });
    }
  });

  router.put(
    "/more/:calories/",
    async ({ params: { calories }, body: { description } }, res) => {
      if (!description || !calories) {
        res.status(401).message("no full info");
      }

      try {
        const modified = await db.pizzas.update(
          {
            description,
          },
          {
            where: {
              calories: {
                [Op.gt]: +calories,
              },
            },
          }
        );
        res.json(modified.every((feild) => feild > 0));
      } catch (e) {
        res.json({ message: e.message });
      }
    }
  );

  return router;
}

module.exports = generatePizzaAdditional;
