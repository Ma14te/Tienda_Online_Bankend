const pool = require('../config/db');

class PedidoDAO {

    /**
     * Crea un nuevo pedido y sus items asociados en una transacción.
     * @param {number} id_usuario El ID del usuario que realiza el pedido.
     * @param {Array<object>} items Un array de objetos, donde cada objeto representa un item del pedido { id_producto, cantidad, precio_unitario }.
     * @returns {Promise<object>} El pedido creado.
     */
    async crear(id_usuario, items) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Calcular el total del pedido
            const total = items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);

            // 2. Insertar en la tabla 'pedidos'
            const pedidoResult = await client.query(
                'INSERT INTO pedidos (id_usuario, total) VALUES ($1, $2) RETURNING *',
                [id_usuario, total]
            );
            const nuevoPedido = pedidoResult.rows[0];

            // 3. Insertar cada item en 'pedido_items'
            for (const item of items) {
                await client.query(
                    'INSERT INTO pedido_items (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                    [nuevoPedido.id_pedido, item.id_producto, item.cantidad, item.precio_unitario]
                );
                // 4. (Opcional pero recomendado) Actualizar el stock del producto
                await client.query(
                    'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
                    [item.cantidad, item.id_producto]
                );
            }

            await client.query('COMMIT');
            return nuevoPedido;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene todos los pedidos de un usuario específico.
     * @param {number} id_usuario El ID del usuario.
     * @returns {Promise<Array<object>>} Una lista de pedidos con sus items.
     */
    async obtenerPorUsuario(id_usuario) {
        const result = await pool.query(`
            SELECT
                p.id_pedido, p.fecha_pedido, p.total,
                json_agg(json_build_object(
                    'id_item_pedido', pi.id_item_pedido,
                    'id_producto', pi.id_producto,
                    'cantidad', pi.cantidad,
                    'precio_unitario', pi.precio_unitario
                )) as items
            FROM pedidos p
            LEFT JOIN pedido_items pi ON p.id_pedido = pi.id_pedido
            WHERE p.id_usuario = $1
            GROUP BY p.id_pedido
            ORDER BY p.fecha_pedido DESC
        `, [id_usuario]);
        return result.rows;
    }
    
    /**
     * Obtiene un pedido específico por su ID.
     * @param {number} id_pedido El ID del pedido.
     * @returns {Promise<object>} El pedido con sus items.
     */
    async obtenerPorId(id_pedido) {
        const result = await pool.query(`
            SELECT
                p.id_pedido, p.id_usuario, p.fecha_pedido, p.total,
                json_agg(json_build_object(
                    'id_item_pedido', pi.id_item_pedido,
                    'id_producto', pi.id_producto,
                    'cantidad', pi.cantidad,
                    'precio_unitario', pi.precio_unitario
                )) as items
            FROM pedidos p
            LEFT JOIN pedido_items pi ON p.id_pedido = pi.id_pedido
            WHERE p.id_pedido = $1
            GROUP BY p.id_pedido
        `, [id_pedido]);
        return result.rows[0];
    }

    /**
     * Obtiene todos los pedidos con información del usuario
     * @returns {Promise<Array<object>>} Lista de todos los pedidos
     */
    async obtenerTodos() {
        const result = await pool.query(`
            SELECT
                p.id_pedido,
                p.id_usuario,
                p.fecha_pedido,
                p.total,
                p.estado,
                u.nombre as nombre_usuario,
                u.email as email_usuario,
                json_agg(json_build_object(
                    'id_item_pedido', pi.id_item_pedido,
                    'id_producto', pi.id_producto,
                    'nombre_producto', prod.nombre,
                    'cantidad', pi.cantidad,
                    'precio_unitario', pi.precio_unitario
                )) as detalles
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN pedido_items pi ON p.id_pedido = pi.id_pedido
            LEFT JOIN productos prod ON pi.id_producto = prod.id_producto
            GROUP BY p.id_pedido, u.nombre, u.email
            ORDER BY p.fecha_pedido DESC
        `);
        return result.rows;
    }

    /**
     * Actualiza el estado de un pedido
     * @param {number} id_pedido El ID del pedido
     * @param {string} estado El nuevo estado
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    async actualizarEstado(id_pedido, estado) {
        const result = await pool.query(
            'UPDATE pedidos SET estado = $1 WHERE id_pedido = $2 RETURNING *',
            [estado, id_pedido]
        );
        return result.rowCount > 0;
    }
}

module.exports = new PedidoDAO();
