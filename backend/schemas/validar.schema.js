const Joi = require("joi");

var validarSchema = Joi.object({
    token: Joi.string().required(),
});

module.exports = validarSchema;