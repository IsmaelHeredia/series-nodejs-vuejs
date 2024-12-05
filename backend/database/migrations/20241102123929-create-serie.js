'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('series', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        unique: true
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      links: {
        type: Sequelize.STRING
      },
      ultima_temporada: {
        type: Sequelize.INTEGER
      },
      ultimo_capitulo: {
        type: Sequelize.INTEGER
      },
      calificacion: {
        type: Sequelize.INTEGER
      },
      estado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'estados', key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('series');
  }
};