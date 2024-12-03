const Joi = require("joi");

var filtroSchema = Joi.object({
    cantidad: Joi.number().required(),
    pagina: Joi.number().required(),
    nombre: Joi.string().allow(null, ""),
    generos: Joi.required(),
    estado: Joi.number().allow(null, ""),
});

module.exports = filtroSchema;