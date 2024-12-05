const { sequelize } = require("../database/models");
const Serie = require('../database/models').serie;
const Genero = require('../database/models').genero;
const SerieGeneros = require('../database/models').seriegeneros;
const Estado = require('../database/models').estado;

const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require("uuid");

const { Op } = require('sequelize');

require("dotenv").config();

module.exports = {

    async filter(data) {

        const limite = data.cantidad ? data.cantidad : Number(process.env.PER_PAGE);
        const pagina = data.pagina ? data.pagina : 1;
        const nombre = data.nombre ? data.nombre : "";
        const generos = data.generos ? data.generos : [];
        const estado_id = data.estado ? data.estado : 0;

        let offset = 0 + (pagina - 1) * limite;

        let filterGeneros = null;

        if (generos.length > 0) {
            filterGeneros = { id: { [Op.in]: generos } };
        }

        let filterEstado = null;

        if (estado_id > 0) {
            filterEstado = { id: estado_id };
        }

        try {

            const listaSeries = await Serie.findAndCountAll({
                where: {
                    nombre: { [Op.regexp]: nombre },
                },
                include: [
                    {
                        model: Estado,
                        as: 'estado',
                        where: filterEstado && filterEstado
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        where: filterGeneros && filterGeneros
                    }
                ],
                offset: offset,
                limit: limite,
                order: [["updated_at", "DESC"]],
                distinct: true,
            });

            const series = listaSeries.rows;
            const cantidad = listaSeries.count;
            const ultima_pagina = Math.ceil(cantidad / limite);

            const resultado = {
                series: listaSeries ? series : [],
                total: cantidad,
                ultima_pagina: ultima_pagina,
                pagina_actual: pagina
            };

            return [resultado, 'Las series se listaron correctamente', 1];

        } catch (error) {

            console.log(error);

            return [null, 'Ocurrió un error listando las series', 0];
        }

    },
    async get(id) {
        const resultado = await Serie.findByPk(id,
            {
                include: [
                    {
                        model: Estado,
                        as: 'estado'
                    },
                    {
                        model: Genero,
                        as: 'generos',
                        through: { attributes: [] },
                    }]
            }
        );
        if (resultado != null) {
            return [resultado, 'La serie se cargó correctamente', 1];
        } else {
            return [null, 'La serie no existe', 0];
        }
    },
    async create(data) {

        let transaction;

        try {
            transaction = await sequelize.transaction();

            const serieGuardado = await Serie.create(
                {
                    nombre: data.nombre,
                    //imagen: data.imagen,
                    links: data.links,
                    ultima_temporada: data.ultima_temporada,
                    ultimo_capitulo: data.ultimo_capitulo,
                    calificacion: data.calificacion,
                    estado_id: data.estado_id,
                    generos: data.generos
                },
                {
                    include: {
                        model: Genero,
                        through: SerieGeneros,
                        as: 'generos',
                        ignoreDuplicates: true
                    }
                },
                { transaction },
            );

            await transaction.commit();

            return [serieGuardado, 'La serie fue registrada correctamente', 1];

        } catch (error) {

            console.log(error);

            if (transaction) {
                await transaction.rollback();
            }

            return [null, 'Ocurrió un error registrando la serie', 0];

        } finally {
            await transaction.cleanup();
        }

    },
    async update(id, data) {

        const datos = await Serie.findByPk(id);

        if (!datos) {
            return [null, 'La serie no existe', 0];
        } else {

            const generos_request = data.generos;

            let lista_generos = [];

            generos_request.forEach(async genero_request => {
                lista_generos.push({
                    "serie_id": id,
                    "genero_id": genero_request.id
                });
            });

            let transaction = await sequelize.transaction()

            try {

                await Serie.update(
                    {
                        nombre: data.nombre,
                        links: data.links,
                        ultima_temporada: data.ultima_temporada,
                        ultimo_capitulo: data.ultimo_capitulo,
                        calificacion: data.calificacion,
                        estado_id: data.estado_id
                    },
                    { where: { id: id } }, { transaction }
                );

                await SerieGeneros.destroy({
                    where: {
                        serie_id: id,
                    },
                    transaction
                });

                await SerieGeneros.bulkCreate(lista_generos, { transaction });

                await transaction.commit();

                const nuevos_datos = await Serie.findByPk(id);

                return [nuevos_datos, 'La serie fue actualizada correctamente', 1];

            } catch (error) {
                await transaction.rollback();
                console.log('error', error);
                return [null, 'Ocurrió un error actualizando la serie', 0];
            } finally {
                await transaction.cleanup();
            }
        }
    },
    async delete(id) {

        const datos = await Serie.findByPk(id);

        if (!datos) {
            return [null, 'La serie no existe', 0];
        } else {

            let transaction;

            try {

                transaction = await sequelize.transaction();

                const image = datos.imagen;

                const upload_folder = path.join(__dirname, '../uploads');

                if (image != null && image != "") {
                    fs.unlinkSync(upload_folder + "/" + image);
                }

                await Serie.destroy({
                    where: {
                        id: id,
                    },
                    transaction
                });

                await transaction.commit();

                return [null, 'La serie fue borrada correctamente', 1];

            } catch (error) {

                console.log(error);

                if (transaction) {
                    await transaction.rollback();
                }

                return [null, 'Ocurrió un error borrando la serie', 0];

            } finally {
                await transaction.cleanup();
            }

        }

    },
    async upload_image(id, imageUpload) {

        const datos_serie = await Serie.findByPk(id, {});

        if (!datos_serie) {
            return [null, 'La serie no existe', 0];
        } else {

            let transaction;

            try {
                transaction = await sequelize.transaction();

                const image = datos_serie.imagen;

                const upload_folder = path.join(__dirname, '../uploads');

                if (image != null && image != "") {
                    fs.unlinkSync(upload_folder + "/" + image);
                }

                var ext = imageUpload.originalFilename.split('.').pop();

                const uuid = uuidv4();

                const newName = uuid + '.' + ext;

                let oldPath = imageUpload.filepath;

                let newPath = upload_folder + '/' + newName;

                let rawData = fs.readFileSync(oldPath);

                fs.writeFileSync(newPath, rawData);

                await Serie.update(
                    {
                        imagen: newName,
                    },
                    { where: { id: id } }, { transaction }
                );

                return [null, 'La imagen se subió al servidor correctamente', 1];

            } catch (error) {

                console.log(error);

                if (transaction) {
                    await transaction.rollback();
                }

                return [null, 'Ocurrió un error subiendo la imagen', 0];

            } finally {
                await transaction.cleanup();
            }

        }
    }
}