'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    static associate(models) {
    }
  }
  usuario.init({
    nombre: DataTypes.STRING,
    clave: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuario',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return usuario;
};