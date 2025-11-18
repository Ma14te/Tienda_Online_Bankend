const PedidoDAO = require('../dao/PedidoDAO');
const ProductoDAO = require('../dao/ProductoDAO');
const { PedidoDTO, PedidoItemDTO } = require('../dto/PedidoDTO');

class PedidoController {

    /**
     * @swagger
     * /api/pedidos:
     *   post:
     *     summary: Crea un nuevo pedido.
     *     description: Crea un nuevo pedido para el usuario autenticado. El stock de los productos se actualiza.
     *     tags: [Pedidos]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               items:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id_producto:
     *                       type: integer
     *                     cantidad:
     *                       type: integer
     *                 example:
     *                   - id_producto: 1
     *                     cantidad: 2
     *                   - id_producto: 3
     *                     cantidad: 1
     *     responses:
     *       201:
     *         description: Pedido creado exitosamente.
     *       400:
     *         description: Datos de entrada inválidos o stock insuficiente.
     *       500:
     *         description: Error del servidor.
     */
    async crearPedido(req, res) {
        try {
            const id_usuario = req.usuario.id_usuario;
            const { items } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ mensaje: 'El campo "items" es requerido y debe ser un array no vacío.' });
            }

            // Validar stock y obtener precios
            const itemsConPrecio = [];
            for (const item of items) {
                const producto = await ProductoDAO.obtenerPorId(item.id_producto);
                if (!producto) {
                    return res.status(400).json({ mensaje: `El producto con ID ${item.id_producto} no existe.` });
                }
                if (producto.stock < item.cantidad) {
                    return res.status(400).json({ mensaje: `Stock insuficiente para el producto "${producto.nombre}". Stock disponible: ${producto.stock}.` });
                }
                itemsConPrecio.push({
                    ...item,
                    precio_unitario: producto.precio
                });
            }

            const nuevoPedido = await PedidoDAO.crear(id_usuario, itemsConPrecio);
            res.status(201).json(nuevoPedido);

        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/pedidos:
     *   get:
     *     summary: Obtiene el historial de pedidos del usuario.
     *     description: Devuelve todos los pedidos realizados por el usuario autenticado.
     *     tags: [Pedidos]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de pedidos.
     *       500:
     *         description: Error del servidor.
     */
    async obtenerPedidosUsuario(req, res) {
        try {
            const id_usuario = req.usuario.id_usuario;
            const pedidos = await PedidoDAO.obtenerPorUsuario(id_usuario);
            const pedidosDTO = pedidos.map(p => new PedidoDTO(
                p.id_pedido,
                p.id_usuario,
                p.fecha_pedido,
                p.total,
                p.items.map(i => new PedidoItemDTO(i.id_item_pedido, i.id_producto, i.cantidad, i.precio_unitario))
            ));
            res.json(pedidosDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
        }
    }
    
    /**
     * @swagger
     * /api/pedidos/{id}:
     *   get:
     *     summary: Obtiene un pedido por su ID.
     *     description: Devuelve un pedido específico, siempre que pertenezca al usuario autenticado.
     *     tags: [Pedidos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Detalles del pedido.
     *       403:
     *         description: Acceso denegado.
     *       404:
     *         description: Pedido no encontrado.
     *       500:
     *         description: Error del servidor.
     */
    async obtenerPedidoPorId(req, res) {
        try {
            const id_pedido = req.params.id;
            const id_usuario = req.usuario.id_usuario;
            
            const pedido = await PedidoDAO.obtenerPorId(id_pedido);

            if (!pedido) {
                return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }

            // Asegurarse de que el usuario solo pueda ver sus propios pedidos
            if (pedido.id_usuario !== id_usuario) {
                return res.status(403).json({ mensaje: 'Acceso denegado. No tienes permiso para ver este pedido.' });
            }

            const pedidoDTO = new PedidoDTO(
                pedido.id_pedido,
                pedido.id_usuario,
                pedido.fecha_pedido,
                pedido.total,
                pedido.items.map(i => new PedidoItemDTO(i.id_item_pedido, i.id_producto, i.cantidad, i.precio_unitario))
            );
            
            res.json(pedidoDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el pedido', error: error.message });
        }
    }

    /**
     * Obtiene todos los pedidos (solo admin)
     */
    async obtenerTodosPedidos(req, res) {
        try {
            const pedidos = await PedidoDAO.obtenerTodos();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
        }
    }

    /**
     * Actualiza el estado de un pedido (solo admin)
     */
    async actualizarEstadoPedido(req, res) {
        try {
            const id_pedido = req.params.id;
            const { estado } = req.body;

            const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
            if (!estado || !estadosValidos.includes(estado)) {
                return res.status(400).json({ mensaje: 'Estado inválido. Debe ser: pendiente, procesando, enviado, entregado o cancelado' });
            }

            const resultado = await PedidoDAO.actualizarEstado(id_pedido, estado);
            
            if (resultado) {
                res.json({ mensaje: 'Estado actualizado correctamente', estado });
            } else {
                res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido', error: error.message });
        }
    }
}

module.exports = new PedidoController();
