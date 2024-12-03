const Joi = require("joi");

var filtroSchema = Joi.object({
    nombre: Joi.string().allow(null, ""),
    pagina: Joi.number().required(),
});

module.exports = filtroSchema;