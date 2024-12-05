const { sequelize } = require("../database/models");

const { Op } = require('sequelize');

const Genero = require('../database/models').genero;

require("dotenv").config();

module.exports = {

    async list() {
        const resultado = await Genero.findAll({
            order: [
                ['nombre', 'ASC'],
            ],
        });
        return [resultado, 'Los géneros se listaron correctamente', 1];
    },
    async filter(data) {

        const nombre = data.nombre ? data.nombre : "";
        const pagina = data.pagina ? data.pagina : 1;

        let limite = Number(process.env.PER_PAGE);

        let offset = 0 + (pagina - 1) * limite;

        try {

            const listaGeneros = await Genero.findAndCountAll({
                where: {
                    nombre: { [Op.regexp]: nombre }
                },
                offset: offset,
                limit: limite,
                order: [
                    ['nombre', 'ASC']
                ],
            });

            const generos = listaGeneros.rows;
            const cantidad = listaGeneros.count;
            const ultima_pagina = Math.ceil(cantidad / limite);

            const resultado = {
                generos: listaGeneros ? generos : [],
                total: cantidad,
                ultima_pagina: ultima_pagina,
                pagina_actual: pagina
            };

            return [resultado, 'Los géneros se listaron correctamente', 1];

        } catch (error) {

            console.log(error);

            return [null, 'Ocurrió un error listando los géneros', 0];
        }

    },
    async get(id) {
        const resultado = await Genero.findByPk(id);
        if (resultado != null) {
            return [resultado, 'El género se cargó correctamente', 1];
        } else {
            return [null, 'El género no existe', 0];
        }
    },
    async create(data) {

        let transaction;

        try {
            transaction = await sequelize.transaction();

            const generoGuardado = await Genero.create(
                {
                    nombre: data.nombre,
                },
                { transaction },
            );

            await transaction.commit();

            return [generoGuardado, 'El género fue registrado correctamente', 1];

        } catch (error) {

            console.log(error);

            if (transaction) {
                await transaction.rollback();
            }

            return [null, 'Ocurrió un error registrando el género', 0];

        } finally {
            await transaction.cleanup();
        }
    },
    async update(id, data) {

        const datos = await Genero.findByPk(id);

        if (!datos) {
            return [null, 'El género no existe', 0];
        } else {

            let transaction;

            try {

                transaction = await sequelize.transaction();

                await Genero.update(
                    {
                        nombre: data.nombre,
                    },
                    { where: { id: id } }, { transaction }
                );

                await transaction.commit();

                const nuevos_datos = await Genero.findByPk(id);

                return [nuevos_datos, 'El género fue actualizado correctamente', 1];

            } catch (error) {

                console.log(error);

                if (transaction) {
                    await transaction.rollback();
                }

                return [null, 'Ocurrió un error actualizando el género', 0];

            } finally {
                await transaction.cleanup();
            }
        }
    },
    async delete(id) {

        const datos = await Genero.findByPk(id);

        if (!datos) {
            return [null, 'El género no existe', 0];
        } else {

            let transaction;

            try {

                transaction = await sequelize.transaction();

                await Genero.destroy({
                    where: {
                        id: id,
                    },
                    transaction
                });

                await transaction.commit();

                return [null, 'El género fue borrado correctamente', 1];

            } catch (error) {

                console.log(error);

                if (transaction) {
                    await transaction.rollback();
                }

                return [null, 'Ocurrió un error borrando el género', 0];

            } finally {
                await transaction.cleanup();
            }

        }
    }
}