var express = require("express");

const usuarioService = require('../services/usuario.service');
const ingresoSchema = require('../schemas/ingreso.schema');

const responses = require('../utils/responses');

var router = express.Router();

/**
 * @swagger
 * /api/ingreso:
     *  post:
     *     tags:
     *     - Usuario Controller
     *     summary: Ingresar al sistema
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - usuario
     *              - clave
     *            properties:
     *              usuario:
     *                type: string
     *                default: admin
     *              clave:
     *                type: string
     *                default: admin
     *     responses:
     *      200:
     *        description: Ingreso corecto
     *      500:
     *        description: Server Error
 */
router.post("/", async function (req, res) {

    try {
        const { error, value } = ingresoSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await usuarioService.login(value);
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