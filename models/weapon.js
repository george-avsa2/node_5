const { DataTypes } = require("sequelize");

module.exports = (Sequelize, sequelize) => {
  return sequelize.define("weapons", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    dps: {
      type: DataTypes.INTEGER,
      default: 0,
    },
  });
};
