var express = require("express");

const generoService = require('../services/genero.service');
const generoSchema = require('../schemas/genero.schema');
const filtroSchema = require('../schemas/filtroGenero.schema');

const responses = require('../utils/responses');
const functions = require('../utils/functions');

const { validateAuth } = require('../middleware/auth');

var router = express.Router();

/**
 * @swagger
 * /api/generos:
 *   get:
 *    tags:
 *    - Género Controller
 *    summary: Se listan los géneros de las series
 *    description: Se envían los datos guardados en la base de datos
 *    responses:
 *      200:
 *        description: Los géneros se listaron correctamente
 */
router.get("/", validateAuth, async function (req, res) {

    try {
        const [datos, mensaje, estado] = await generoService.list();

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

/**
 * @swagger
 * /api/generos/filtrar:
     *  post:
     *     tags:
     *     - Género Controller
     *     summary: Se filtran géneros por nombre y número de página
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - nombre
     *              - pagina
     *            properties:
     *              nombre:
     *                type: string
     *                default: nombre
     *              pagina:
     *                type: integer
     *                default: 1
     *     responses:
     *      200:
     *        description: Los datos se filtraron correctamente
     *      500:
     *        description: Server Error
 */
router.post("/filtrar", validateAuth, async function (req, res) {

    console.log('req', req.body);

    try {
        const { error, value } = filtroSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await generoService.filter(value);
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

/**
 * @swagger
 *  /api/generos/{generoId}:
 *   get:
 *     tags:
 *     - Género Controller
 *     summary: Se cargar los datos del género
 *     description: Se envían los datos guardados en la base de datos
 *     parameters:
 *       - in: path
 *         name: generoId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: El género se cargó correctamente
 */
router.get("/:id", validateAuth, async function (req, res) {

    try {
        var id = req.params.id;

        if (!functions.isNumber(id)) {
            const respuesta = responses.send_error();
            return res.json(respuesta);
        }

        const [datos, mensaje, estado] = await generoService.get(id);

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

/**
 * @swagger
 * /api/generos:
     *  post:
     *     tags:
     *     - Género Controller
     *     summary: Registro de un género nuevo
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - nombre
     *            properties:
     *              nombre:
     *                type: string
     *                default: nombre
     *     responses:
     *      200:
     *        description: Los datos se registraron correctamente
     *      500:
     *        description: Server Error
 */
router.post("/", validateAuth, async function (req, res) {

    console.log('req', req.body);

    try {
        const { error, value } = generoSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await generoService.create(value);
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

/**
 * @swagger
 * /api/generos/{generoId}:
     *  put:
     *     tags:
     *     - Género Controller
     *     summary: Edición del género especificado
     *     parameters:
     *       - in: path
     *         name: generoId
     *         type: integer
     *         required: true
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - nombre
     *            properties:
     *              nombre:
     *                type: string
     *                default: nombre
     *     responses:
     *      200:
     *        description: Los datos se actualizaron correctamente
     *      500:
     *        description: Server Error
 */
router.put("/:id", validateAuth, async (req, res) => {

    try {
        var id = req.params.id;

        if (!functions.isNumber(id)) {
            const respuesta = responses.send_error();
            return res.json(respuesta);
        }

        const { error, value } = generoSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await generoService.update(id, value);
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

/**
 * @swagger
 * /api/generos/{generoId}:
     *  delete:
     *     tags:
     *     - Género Controller
     *     summary: Eliminación del género especificado
     *     parameters:
     *       - in: path
     *         name: generoId
     *         type: integer
     *         required: true
     *     responses:
     *      200:
     *        description: El registro de borró correctamente
     *      500:
     *        description: Server Error
 */
router.delete("/:id", validateAuth, async function (req, res) {

    try {
        var id = req.params.id;

        if (!functions.isNumber(id)) {
            const respuesta = responses.send_error();
            return res.json(respuesta);
        }

        const [datos, mensaje, estado] = await generoService.delete(id);

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