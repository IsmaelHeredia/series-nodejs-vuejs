const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require("cors");

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

require("dotenv").config();

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

var ingreso = require("./controllers/ingreso.controller");
var validar = require("./controllers/validar.controller");
var genero = require("./controllers/genero.controller");
var estado = require("./controllers/estado.controller");
var serie = require("./controllers/serie.controller");
var cuenta = require("./controllers/cuenta.controller");

app.use("/api/ingreso", ingreso);
app.use("/api/validar", validar);
app.use("/api/estados", estado);
app.use("/api/generos", genero);
app.use("/api/series", serie);
app.use("/api/cuenta", cuenta);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/uploads', express.static(process.cwd() + '/uploads'))

const port = parseInt(process.env.PORT, 10);

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

console.log(`API is listening on port http://localhost:${port}`);

module.exports = app;