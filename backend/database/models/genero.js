'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genero extends Model {
    static associate(models) {

      genero.belongsToMany(models.serie, {
        foreignKey: 'genero_id',
        through: models.seriegeneros,
        as: 'serie'
      });

    }
  }
  genero.init({
    nombre: {
      type: DataTypes.STRING,
      unique: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'genero',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return genero;
};