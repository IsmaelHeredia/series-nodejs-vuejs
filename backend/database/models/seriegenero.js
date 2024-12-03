'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seriegenero extends Model {
    static associate(models) {
    }
  }
  seriegenero.init({
    serie_id: DataTypes.INTEGER,
    genero_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'seriegeneros',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return seriegenero;
};