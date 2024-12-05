'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Acción',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Ciencia ficción',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Aventura',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Comedia',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Drama',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Suspenso',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Fantástico',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Terror',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Animadas',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    await queryInterface.bulkInsert('generos', [{
      nombre: 'Documentales',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('generos', null, {});
  }
};
