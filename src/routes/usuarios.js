const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// Rutas protegidas
router.get('/', authMiddleware, UsuarioController.obtenerUsuarios);
router.get('/:id', authMiddleware, UsuarioController.obtenerUsuarioPorId);
router.put('/:id', authMiddleware, UsuarioController.actualizarUsuario);
router.delete('/:id', authMiddleware, UsuarioController.eliminarUsuario);

module.exports = router;
