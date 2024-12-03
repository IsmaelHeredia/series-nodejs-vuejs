var jwt = require("jsonwebtoken");

require("dotenv").config();

const validateAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
        const token = header.slice(7, header.length);
        console.log('token', token);
        try {
            jwt.verify(token, String(process.env.SECRET_KEY));
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token no válido' });
        }
    } else {
        res.status(401).json({ error: 'Token no proporcionado' });
    }
};

module.exports = { validateAuth };