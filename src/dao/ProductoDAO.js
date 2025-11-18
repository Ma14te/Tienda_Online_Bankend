const pool = require('../config/db');

class ProductoDAO {

    async crear(id_categoria, nombre, descripcion, precio, stock) {
        const result = await pool.query(
            'INSERT INTO productos (id_categoria, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_categoria, nombre, descripcion, precio, stock]
        );
        return result.rows[0];
    }

    async obtenerTodos() {
        const result = await pool.query(`
            SELECT p.*, COALESCE(
                (SELECT json_agg(json_build_object('id_imagen', i.id_imagen, 'url_imagen', i.url_imagen, 'es_principal', i.es_principal))
                 FROM imagenes_productos i WHERE i.id_producto = p.id_producto), '[]'::json
            ) as imagenes
            FROM productos p
        `);
        return result.rows;
    }

    async obtenerPorId(id) {
        const result = await pool.query(`
            SELECT p.*, COALESCE(
                (SELECT json_agg(json_build_object('id_imagen', i.id_imagen, 'url_imagen', i.url_imagen, 'es_principal', i.es_principal))
                 FROM imagenes_productos i WHERE i.id_producto = p.id_producto), '[]'::json
            ) as imagenes
            FROM productos p
            WHERE p.id_producto = $1
        `, [id]);
        return result.rows[0];
    }

    async actualizar(id, id_categoria, nombre, descripcion, precio, stock) {
        const result = await pool.query(
            'UPDATE productos SET id_categoria = $1, nombre = $2, descripcion = $3, precio = $4, stock = $5 WHERE id_producto = $6 RETURNING *',
            [id_categoria, nombre, descripcion, precio, stock, id]
        );
        return result.rows[0];
    }

    async eliminar(id) {
        // Primero eliminar imágenes asociadas
        await pool.query('DELETE FROM imagenes_productos WHERE id_producto = $1', [id]);
        const result = await pool.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new ProductoDAO();
