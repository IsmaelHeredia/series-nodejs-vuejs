var express = require("express");

const serieService = require('../services/serie.service');
const serieSchema = require('../schemas/serie.schema');
const filtroSchema = require('../schemas/filtroSerie.schema');

const responses = require('../utils/responses');
const functions = require('../utils/functions');

const { validateAuth } = require('../middleware/auth');

var router = express.Router();

const formidable = require('formidable');

/**
 * @swagger
 * /api/series/filtrar:
     *  post:
     *     tags:
     *     - Serie Controller
     *     summary: Se filtran series por nombre y número de página
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - cantidad
     *              - pagina
     *              - nombre
     *              - generos
     *              - estado
     *            properties:
     *              cantidad:
     *                type: integer
     *                default: 20
     *              pagina:
     *                type: integer
     *                default: 1
     *              nombre:
     *                type: string
     *                default: nombre
     *              generos:
     *                type: string
     *                default: [ {"id":1,"nombre":"Acción"}, {"id":2,"nombre":"Ciencia ficción"} ]
     *              estado:
     *                type: integer
     *                default: 1
     *     responses:
     *      200:
     *        description: Los datos se filtraron correctamente
     *      500:
     *        description: Server Error
 */
router.post("/filtrar", validateAuth, async function (req, res) {

    try {
        const { error, value } = filtroSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await serieService.filter(value);
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
 *  /api/series/{serieId}:
 *   get:
 *     tags:
 *     - Serie Controller
 *     summary: Se cargar los datos de la serie
 *     description: Se envían los datos guardados en la base de datos
 *     parameters:
 *       - in: path
 *         name: serieId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: La serie se cargó correctamente
 */
router.get("/:id", validateAuth, async function (req, res) {

    try {
        var id = req.params.id;

        if (!functions.isNumber(id)) {
            const respuesta = responses.send_error();
            return res.json(respuesta);
        }

        const [datos, mensaje, estado] = await serieService.get(id);

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
 * /api/series:
     *  post:
     *     tags:
     *     - Serie Controller
     *     summary: Registro de una serie nueva
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - nombre
     *              - links
     *              - ultima_temporada
     *              - ultimo_capitulo
     *              - calificacion
     *              - estado_id
     *              - generos
     *            properties:
     *              nombre:
     *                type: string
     *                default: nombre
     *              links:
     *                type: string
     *                default: links
     *              ultima_temporada:
     *                type: integer
     *                default: 1
     *              ultimo_capitulo:
     *                type: integer
     *                default: 1
     *              calificacion:
     *                type: integer
     *                default: 5
     *              estado_id:
     *                type: integer
     *                default: 1
     *              generos:
     *                type: string
     *                default: [ {"id":1,"nombre":"Acción"}, {"id":2,"nombre":"Ciencia ficción"} ]
     *     responses:
     *      200:
     *        description: Los datos se registraron correctamente
     *      500:
     *        description: Server Error
 */
router.post("/", validateAuth, async function (req, res) {

    try {

        console.log('fields', req.body);

        console.log(typeof req.body);

        const { error, value } = serieSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await serieService.create(value);
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
 * /api/series/{serieId}:
     *  put:
     *     tags:
     *     - Serie Controller
     *     summary: Edición de la serie especificada
     *     parameters:
     *       - in: path
     *         name: serieId
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
     *              - links
     *              - ultima_temporada
     *              - ultimo_capitulo
     *              - calificacion
     *              - estado_id
     *              - generos
     *            properties:
     *              nombre:
     *                type: string
     *                default: nombre
     *              links:
     *                type: string
     *                default: links
     *              ultima_temporada:
     *                type: integer
     *                default: 1
     *              ultimo_capitulo:
     *                type: integer
     *                default: 1
     *              calificacion:
     *                type: integer
     *                default: 5
     *              estado_id:
     *                type: integer
     *                default: 1
     *              generos:
     *                type: string
     *                default: [ {"id":1,"nombre":"Acción"}, {"id":2,"nombre":"Ciencia ficción"} ]
     *     responses:
     *      200:
     *        description: Los datos se actualizaron correctamente
     *      500:
     *        description: Server Error
 */
router.put("/:id", validateAuth, async (req, res) => {

    console.log('fields', req.body);

    try {
        var id = req.params.id;

        if (!functions.isNumber(id)) {
            const respuesta = responses.send_error();
            return res.json(respuesta);
        }

        const { error, value } = serieSchema.validate(req.body);

        if (!error) {
            const [datos, mensaje, estado] = await serieService.update(id, value);
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
 * /api/series/{serieId}:
     *  delete:
     *     tags:
     *     - Serie Controller
     *     summary: Eliminación de la serie especificada
     *     parameters:
     *       - in: path
     *         name: serieId
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

        const [datos, mensaje, estado] = await serieService.delete(id);

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
 * /api/series/{serieId}/subirImagen:
     *  post:
     *     tags:
     *     - Serie Controller
     *     summary: Subir una imagen para la serie especificada
     *     consumes:
     *      - multipart/form-data
     *     parameters:
     *       - in: path
     *         name: serieId
     *         type: integer
     *         required: true
     *       - in: formData
     *         name: imagen
     *         type: file
     *         required: true
     *         description: La imagen a subir
     *     responses:
     *      200:
     *        description: La imagen se subió correctamente
     *      500:
     *        description: Server Error
 */
router.post("/:id/subirImagen", validateAuth, async function (req, res) {

    var id = req.params.id;

    if (!functions.isNumber(id)) {
        const respuesta = responses.send_error();
        return res.json(respuesta);
    }

    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {

        console.log('files', files);

        const imageUpload = files.imagen[0];
        const originalFilename = imageUpload.originalFilename;
        const mimetype = imageUpload.mimetype;

        console.log(imageUpload);
        console.log(originalFilename);
        console.log(mimetype);

        if (functions.isImage(originalFilename, mimetype)) {
            const [datos, mensaje, estado] = await serieService.upload_image(id, imageUpload);
            if (estado == 1) {
                const respuesta = responses.send_success(mensaje);
                res.json(respuesta);
            } else {
                const respuesta = responses.send_warning(mensaje);
                res.json(respuesta);
            }
        } else {
            const respuesta = responses.send_warning(mensaje);
            res.json(respuesta);
        }
    });

});

module.exports = router;