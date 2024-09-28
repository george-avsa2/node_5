const express = require("express");

function generateBasicCRUD(model) {
  const router = express.Router();

  router.get("/", async ({ query: { id } }, res) => {
    const findConfig = {};

    if (id) {
      findConfig.where = { id };
    }

    try {
      const item = await model[!id ? "findAll" : "findOne"]();

      res.json(item || {});
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  router.post("/", async ({ body }, res) => {
    try {
      const item = await model.create(body);
      res.json(item);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  router.put("/", async ({ body, query: { id } }, res) => {
    try {
      const item = await model.update(body, { where: { id } });
      res.json(item[0] > 0);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  });

  router.delete("/", async ({ query: { id } }, res) => {
    try {
      const item = await model.destroy({
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

module.exports = generateBasicCRUD;
