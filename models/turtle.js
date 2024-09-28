const { DataTypes } = require("sequelize");

module.exports = (Sequelize, sequelize) => {
  return sequelize.define("turtles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
};
