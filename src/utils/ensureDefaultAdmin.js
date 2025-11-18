const UsuarioDAO = require('../dao/UsuarioDAO');
const pool = require('../config/db');

async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@tienda.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const nombre = process.env.ADMIN_NAME || 'Administrador';
  try {
    const existing = await UsuarioDAO.obtenerPorEmail(email);
    if (!existing) {
      const nuevo = await UsuarioDAO.crear(nombre, email, password);
      await pool.query('UPDATE usuarios SET es_admin = TRUE WHERE id_usuario = $1', [nuevo.id_usuario]);
      console.log(`[seed] Admin creado por defecto: ${email}`);
    } else if (!existing.es_admin) {
      await pool.query('UPDATE usuarios SET es_admin = TRUE WHERE id_usuario = $1', [existing.id_usuario]);
      console.log(`[seed] Usuario existente marcado como admin: ${email}`);
    } else {
      // Ya es admin; no hacer nada
    }
  } catch (e) {
    console.error('[seed] No se pudo asegurar admin por defecto:', e.message);
  }
}

module.exports = ensureDefaultAdmin;