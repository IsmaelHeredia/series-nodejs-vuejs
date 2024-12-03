'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serie extends Model {
    static associate(models) {

      serie.belongsTo(models.estado,
        {
          as: 'estado',
          foreignKey: 'estado_id',
        }
      );

      serie.belongsToMany(models.genero, {
        foreignKey: 'serie_id',
        through: models.seriegeneros,
        as: 'generos'
      });

    }
  }
  serie.init({
    nombre: DataTypes.STRING,
    imagen: DataTypes.STRING,
    links: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    ultima_temporada: DataTypes.INTEGER,
    ultimo_capitulo: DataTypes.INTEGER,
    calificacion: DataTypes.INTEGER,
    estado_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'serie',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return serie;
};