var express = require("express");

const usuarioService = require('../services/usuario.service');
const cuentaSchema = require('../schemas/cuenta.schema');

const responses = require('../utils/responses');

const { validateAuth } = require('../middleware/auth');

var router = express.Router();

/**
 * @swagger
 * /api/cuenta:
     *  post:
     *     tags:
     *     - Usuario Controller
     *     summary: Actualizar datos de cuenta
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - usuario
     *              - nuevo_usuario
     *              - clave
     *              - nueva_clave
     *            properties:
     *              usuario:
     *                type: string
     *                default: admin
     *              nuevo_usuario:
     *                type: string
     *                default: admin2
     *              clave:
     *                type: string
     *                default: admin
     *              nueva_clave:
     *                type: string
     *                default: admin2
     *     responses:
     *      200:
     *        description: Cuenta actualizada correctamente
     *      500:
     *        description: Server Error
 */
router.post("/", validateAuth, async function (req, res) {

    try {
        const { error, value } = cuentaSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await usuarioService.update_account(value);
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