const Joi = require("joi");

var ingresoSchema = Joi.object({
    usuario: Joi.string().required(),
    nuevo_usuario: Joi.string().required(),
    clave: Joi.string().required(),
    nueva_clave: Joi.string().required(),
});

module.exports = ingresoSchema;