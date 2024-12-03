const Joi = require("joi");

var ingresoSchema = Joi.object({
    usuario: Joi.string().required(),
    clave: Joi.string().required(),
});

module.exports = ingresoSchema;