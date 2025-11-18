const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Todas las rutas de pedidos requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */

router.post('/', PedidoController.crearPedido);
router.get('/', PedidoController.obtenerPedidosUsuario);
router.get('/todos', adminMiddleware, PedidoController.obtenerTodosPedidos);
router.get('/:id', PedidoController.obtenerPedidoPorId);
router.put('/:id/estado', adminMiddleware, PedidoController.actualizarEstadoPedido);

// PUT y DELETE para pedidos no se implementan generalmente, 
// ya que un pedido una vez realizado no debería modificarse o eliminarse,
// sino cancelarse (lo que implicaría una lógica de negocio más compleja,
// como la devolución de stock, etc.).

module.exports = router;
