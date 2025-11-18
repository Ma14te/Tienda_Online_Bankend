const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UsuarioDAO {

    async crear(nombre, email, password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, hashedPassword]
        );
        return result.rows[0];
    }

    async obtenerPorEmail(email) {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0];
    }

    async obtenerPorId(id) {
        const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
        return result.rows[0];
    }

    async obtenerTodos() {
    const result = await pool.query('SELECT id_usuario, nombre, email, es_admin, fecha_registro FROM usuarios');
        return result.rows;
    }

    async actualizar(id, nombre, email) {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, email = $2 WHERE id_usuario = $3 RETURNING *',
            [nombre, email, id]
        );
        return result.rows[0];
    }

    async eliminar(id) {
        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new UsuarioDAO();
