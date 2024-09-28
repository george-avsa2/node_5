const { Op } = require("sequelize");

function generateWeaponAdditional(db, router) {
  // в идеале все запросы подогнуть под очевидные поля сортировки
  // можно было для where название поля передавать в body и тип: equal, greater, less
  // чтобы не делать отдельный запрос
  router.get("/dps/:value", async ({ params: { value } }, res) => {
    const weapons = await db.weapons.findAll({
      where: {
        dps: {
          [Op.gt]: +value,
        },
      },
    });

    res.json(weapons);
  });

  return router;
}

module.exports = generateWeaponAdditional;
