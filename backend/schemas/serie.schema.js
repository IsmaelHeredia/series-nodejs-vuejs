const Joi = require("joi");

var serieSchema = Joi.object({
    nombre: Joi.string().required(),
    links: Joi.string().required(),
    ultima_temporada: Joi.number().required(),
    ultimo_capitulo: Joi.number().required(),
    calificacion: Joi.number().required(),
    estado_id: Joi.number().required(),
    generos: Joi.required()
});

module.exports = serieSchema;