var express = require("express");

const usuarioService = require('../services/usuario.service');
const validarSchema = require('../schemas/validar.schema');

const responses = require('../utils/responses');

var router = express.Router();

/**
 * @swagger
 * /api/validar:
     *  post:
     *     tags:
     *     - Usuario Controller
     *     summary: Validar token
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - token
     *            properties:
     *              usuario:
     *                type: string
     *                default: token
     *     responses:
     *      200:
     *        description: Validación corecta
     *      500:
     *        description: Server Error
 */
router.post("/", async function (req, res) {

    try {
        const { error, value } = validarSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await usuarioService.validate(value);
            if (estado == 1) {
                const respuesta = responses.send_success(mensaje, datos);
                res.json(respuesta);
            } else {
                const respuesta = responses.send_warning(mensaje);
                res.json(respuesta);
            }
        } else {
            const respuesta = responses.send_warning(error.details);
            res.json(respuesta);
        }
    }
    catch (error) {
        console.log('error', error);
        const respuesta = responses.send_error();
        res.json(respuesta);
    }

});

module.exports = router;