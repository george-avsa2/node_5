const { DataTypes } = require("sequelize");

module.exports = (Sequelize, sequelize) => {
  return sequelize.define("color", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
