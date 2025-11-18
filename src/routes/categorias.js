const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// --- RUTAS PÚBLICAS ---
// (Para que la tienda pueda mostrar las categorías)
router.get('/', CategoriaController.obtenerCategorias);
router.get('/:id', CategoriaController.obtenerCategoriaPorId);

// --- RUTAS PROTEGIDAS (Solo Admin) ---
// (Para el panel de administración)
router.post('/', authMiddleware, adminMiddleware, CategoriaController.crearCategoria);
router.put('/:id', authMiddleware, adminMiddleware, CategoriaController.actualizarCategoria);
router.delete('/:id', authMiddleware, adminMiddleware, CategoriaController.eliminarCategoria);

module.exports = router;