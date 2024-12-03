'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class estado extends Model {
    static associate(models) {
    }
  }
  estado.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'estado',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return estado;
};