const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rutas públicas para ver productos
router.get('/', ProductoController.obtenerProductos);
router.get('/:id', ProductoController.obtenerProductoPorId);

// Rutas protegidas para administrar productos
router.post('/', authMiddleware, adminMiddleware, ProductoController.crearProducto);
router.put('/:id', authMiddleware, adminMiddleware, ProductoController.actualizarProducto);
router.delete('/:id', authMiddleware, adminMiddleware, ProductoController.eliminarProducto);

module.exports = router;
