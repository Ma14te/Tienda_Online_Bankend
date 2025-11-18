const pool = require('../config/db');

class CategoriaDAO {

    async crear(nombre, descripcion) {
        const result = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion]
        );
        return result.rows[0];
    }

    async obtenerTodas() {
        const result = await pool.query('SELECT * FROM categorias');
        return result.rows;
    }

    async obtenerPorId(id) {
        const result = await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
        return result.rows[0];
    }

    async actualizar(id, nombre, descripcion) {
        const result = await pool.query(
            'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *',
            [nombre, descripcion, id]
        );
        return result.rows[0];
    }

    async eliminar(id) {
        const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new CategoriaDAO();
