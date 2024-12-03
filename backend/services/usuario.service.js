const sequelize = require('sequelize');
const Usuario = require('../database/models').usuario;

var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

require("dotenv").config();

module.exports = {

    async login(data) {

        const usuario_bd = await Usuario.findOne({
            where: {
                nombre: data.usuario
            }
        });

        if (usuario_bd) {

            const pwd_db = usuario_bd.clave;

            if (bcrypt.compareSync(data.clave, pwd_db)) {

                const token = jwt.sign(
                    {
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                        email: data.usuario + "@localhost.com",
                        username: data.usuario,
                    },
                    String(process.env.SECRET_KEY)
                );

                return [token, "Bienvenido al sistema", 1];

            } else {
                return [null, "La clave es incorrecta", 0];
            }

        } else {
            return [null, "El usuario no existe", 0];
        }
    },
    async update_account(data) {

        const usuario_bd = await Usuario.findOne({
            where: {
                nombre: data.usuario
            }
        });

        if (usuario_bd) {

            const pwd_db = usuario_bd.clave;

            if (bcrypt.compareSync(data.clave, pwd_db)) {

                const salt = bcrypt.genSaltSync(10);
                const new_password = bcrypt.hashSync(data.nueva_clave, salt);

                usuario_bd.nombre = data.nuevo_usuario;
                usuario_bd.clave = new_password;

                await usuario_bd.save();

                return [null, "Los datos fueron actualizados correctamente", 1];
            } else {
                return [null, "La clave es incorrecta", 0];
            }

        } else {
            return [null, "El usuario no existe", 0];
        }
    },
    async validate(data) {
        try {
            const jwt_data = jwt.verify(data.token, String(process.env.SECRET_KEY));
            return [jwt_data, "El token fue validado correctamente", 1];
        } catch (error) {
            return [null, "El token no es válido", 0];
        }
    }
}