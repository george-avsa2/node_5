const Turtle = require("./turtle");
const Weapon = require("./weapon");
const Pizza = require("./pizza");
const Color = require("./color");

module.exports = (Sequelize, config) => {
  const sequelize = new Sequelize(config.DB_URI);

  const weapons = Weapon(Sequelize, sequelize);
  const turtles = Turtle(Sequelize, sequelize);
  const pizzas = Pizza(Sequelize, sequelize);
  const colors = Color(Sequelize, sequelize);

  weapons.hasMany(turtles, {
    foreignKey: "weaponId",
  });
  turtles.belongsTo(weapons);

  colors.hasMany(turtles, {
    foreignKey: "colorId",
  });
  turtles.belongsTo(colors);

  pizzas.hasMany(turtles, {
    foreignKey: "firstFavoritePizzaId",
  });

  pizzas.hasMany(turtles, {
    foreignKey: "secondFavoritePizzaId",
  });

  turtles.belongsTo(pizzas, {
    foreignKey: "firstFavoritePizzaId",
    as: "firstFavoritePizza",
  });

  turtles.belongsTo(pizzas, {
    foreignKey: "secondFavoritePizzaId",
    as: "secondFavoritePizza",
  });

  return {
    turtles,
    weapons,
    pizzas,
    colors,

    sequelize: sequelize,
    Sequelize: Sequelize,
  };
};
