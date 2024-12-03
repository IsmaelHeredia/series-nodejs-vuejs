var express = require("express");

const estadoService = require('../services/estado.service');
const responses = require('../utils/responses');

const { validateAuth } = require('../middleware/auth');

var router = express.Router();

/**
 * @swagger
 * /api/estados:
 *   get:
 *    tags:
 *    - Estado Controller
 *    summary: Se listan los estados de las series
 *    description: Se envían los datos guardados en la base de datos
 *    responses:
 *      200:
 *        description: Los estados se listaron correctamente
 */
router.get("/", validateAuth, async function (req, res) {

    try {
        const [datos, mensaje, estado] = await estadoService.list();

        if (estado == 1) {
            const respuesta = responses.send_success(mensaje, datos);
            res.json(respuesta);
        } else {
            const respuesta = responses.send_warning(mensaje);
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