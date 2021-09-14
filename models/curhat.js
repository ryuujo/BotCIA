'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Curhat extends Model {
    static associate(models) {
      // define association here
    }
  };
  Curhat.init({
    skey: DataTypes.STRING,
    userId: DataTypes.STRING,
    userName: DataTypes.STRING,
    message: DataTypes.TEXT("long")
  }, {
    sequelize,
    modelName: 'Curhat',
  });
  return Curhat;
};