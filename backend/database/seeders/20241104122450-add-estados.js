'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Sin empezar',
      color: 'gray',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'En proceso',
      color: 'yellow',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Finalizada',
      color: 'green',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Por renovar',
      color: 'orange',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Cancelada',
      color: 'red',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('estados', null, {});

  }
};
