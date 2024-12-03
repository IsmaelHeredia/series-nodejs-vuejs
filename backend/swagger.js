const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Series API',
        version: '1.0.0',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [
        './app/usuario/ingreso.controller.js',
        './app/usuario/validar.controller.js',
        './app/usuario/cuenta.controller.js',
        './app/estado/estado.controller.js',
        './app/genero/genero.controller.js',
        './app/serie/serie.controller.js',
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;