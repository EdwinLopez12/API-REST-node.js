const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Acceso denegado');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (erro) {
        res.status(400).send('Token invalido');
    }
}
