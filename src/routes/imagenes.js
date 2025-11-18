const express = require('express');
const router = express.Router();
const ImagenProductoController = require('../controllers/ImagenProductoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rutas públicas para ver imágenes
router.get('/producto/:id_producto', ImagenProductoController.obtenerImagenesPorProducto);

// Rutas protegidas para administrar imágenes
router.post('/', authMiddleware, adminMiddleware, ImagenProductoController.agregarImagen);
router.put('/:id', authMiddleware, adminMiddleware, ImagenProductoController.actualizarImagen);
router.delete('/:id', authMiddleware, adminMiddleware, ImagenProductoController.eliminarImagen);

module.exports = router;
