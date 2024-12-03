const Joi = require("joi");

var generoSchema = Joi.object({
    nombre: Joi.string().required(),
});

module.exports = generoSchema;