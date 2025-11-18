const pool = require('../config/db');

class ImagenProductoDAO {

    async agregar(id_producto, url_imagen, es_principal = false) {
        const result = await pool.query(
            'INSERT INTO imagenes_productos (id_producto, url_imagen, es_principal) VALUES ($1, $2, $3) RETURNING *',
            [id_producto, url_imagen, es_principal]
        );
        return result.rows[0];
    }

    async obtenerPorProducto(id_producto) {
        const result = await pool.query('SELECT * FROM imagenes_productos WHERE id_producto = $1', [id_producto]);
        return result.rows;
    }

    async eliminar(id_imagen) {
        const result = await pool.query('DELETE FROM imagenes_productos WHERE id_imagen = $1 RETURNING *', [id_imagen]);
        return result.rows[0];
    }
    
    async obtenerPorId(id_imagen) {
        const result = await pool.query('SELECT * FROM imagenes_productos WHERE id_imagen = $1', [id_imagen]);
        return result.rows[0];
    }

    async actualizar(id_imagen, { url_imagen, es_principal }) {
        // Traer imagen para conocer id_producto cuando se cambie principal
        const actual = await this.obtenerPorId(id_imagen);
        if (!actual) return null;

        // Construir actualización parcial para url_imagen
        const sets = [];
        const values = [];
        let idx = 1;
        if (typeof url_imagen !== 'undefined') {
            sets.push(`url_imagen = $${idx++}`);
            values.push(url_imagen);
        }

        // Si solo se cambia url, ejecuta update básico
        let updatedRow = actual;
        if (sets.length > 0) {
            values.push(id_imagen);
            const sql = `UPDATE imagenes_productos SET ${sets.join(', ')} WHERE id_imagen = $${idx} RETURNING *`;
            const res = await pool.query(sql, values);
            updatedRow = res.rows[0];
        }

        // Manejar principal: si viene definido, actualiza bandera y, si es true, desmarca otras del mismo producto
        if (typeof es_principal !== 'undefined') {
            if (es_principal === true) {
                // Desmarcar otras imágenes del mismo producto
                await pool.query(
                    'UPDATE imagenes_productos SET es_principal = FALSE WHERE id_producto = $1 AND id_imagen <> $2',
                    [actual.id_producto, id_imagen]
                );
                const res2 = await pool.query(
                    'UPDATE imagenes_productos SET es_principal = TRUE WHERE id_imagen = $1 RETURNING *',
                    [id_imagen]
                );
                updatedRow = res2.rows[0];
            } else {
                const res3 = await pool.query(
                    'UPDATE imagenes_productos SET es_principal = FALSE WHERE id_imagen = $1 RETURNING *',
                    [id_imagen]
                );
                updatedRow = res3.rows[0];
            }
        }

        return updatedRow;
    }
}

module.exports = new ImagenProductoDAO();
