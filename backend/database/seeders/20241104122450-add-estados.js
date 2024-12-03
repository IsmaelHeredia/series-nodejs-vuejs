'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Sin empezar',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'En proceso',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Finalizada',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Por renovar',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('estados', [{
      nombre: 'Cancelada',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('estados', null, {});

  }
};
