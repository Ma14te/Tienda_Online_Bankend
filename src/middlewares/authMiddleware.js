const jwt = require('jsonwebtoken');
const UsuarioDAO = require('../dao/UsuarioDAO');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = await UsuarioDAO.obtenerPorId(decoded.id);
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autorizado' });
        }
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};
