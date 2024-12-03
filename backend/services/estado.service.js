const sequelize = require('sequelize');
const Estado = require('../database/models').estado;

module.exports = {

    async list() {
        const resultado = await Estado.findAll({});
        return [resultado, 'Los estados se listaron correctamente', 1];
    }
}