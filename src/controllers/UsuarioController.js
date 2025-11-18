/*
* CÓDIGO COMPLETO Y MODIFICADO: src_bankend/controllers/UsuarioController.js
*/

const UsuarioDAO = require('../dao/UsuarioDAO');
const UsuarioDTO = require('../dto/UsuarioDTO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioController {

    async registrar(req, res) {
        try {
            const { nombre, email, password } = req.body;
            if (!nombre || !email || !password) {
                return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
            }
            const existeUsuario = await UsuarioDAO.obtenerPorEmail(email);
            if (existeUsuario) {
                return res.status(400).json({ mensaje: 'El email ya está registrado' });
            }
            const nuevoUsuario = await UsuarioDAO.crear(nombre, email, password);
            const usuarioDTO = new UsuarioDTO(nuevoUsuario.id_usuario, nuevoUsuario.nombre, nuevoUsuario.email, nuevoUsuario.fecha_registro, nuevoUsuario.es_admin);
            res.status(201).json(usuarioDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ mensaje: 'Email y password son requeridos' });
            }
            const usuario = await UsuarioDAO.obtenerPorEmail(email);
            if (!usuario) {
                return res.status(400).json({ mensaje: 'Credenciales inválidas' });
            }
            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(400).json({ mensaje: 'Credenciales inválidas' });
            }
            const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            // --- MODIFICACIÓN AQUÍ ---
            // Añadimos 'nombre: usuario.nombre' a la respuesta.
            res.json({ 
                token, 
                es_admin: usuario.es_admin === true,
                nombre: usuario.nombre // <-- ESTO ES LO QUE FALTABA
            });
            // -------------------------

        } catch (error) {
            res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
        }
    }

    async obtenerUsuarios(req, res) {
        try {
            const usuarios = await UsuarioDAO.obtenerTodos();
            const usuariosDTO = usuarios.map(u => new UsuarioDTO(u.id_usuario, u.nombre, u.email, u.fecha_registro, u.es_admin));
            res.json(usuariosDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
        }
    }

    async obtenerUsuarioPorId(req, res) {
        try {
            const id = req.params.id;
            const usuario = await UsuarioDAO.obtenerPorId(id);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            const usuarioDTO = new UsuarioDTO(usuario.id_usuario, usuario.nombre, usuario.email, usuario.fecha_registro, usuario.es_admin);
            res.json(usuarioDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
        }
    }

    async actualizarUsuario(req, res) {
        try {
            const id = req.params.id;
            const { nombre, email } = req.body;
            if (!nombre || !email) {
                return res.status(400).json({ mensaje: 'Nombre y email son requeridos' });
            }
            const usuarioActualizado = await UsuarioDAO.actualizar(id, nombre, email);
            if (!usuarioActualizado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            const usuarioDTO = new UsuarioDTO(usuarioActualizado.id_usuario, usuarioActualizado.nombre, usuarioActualizado.email, usuarioActualizado.fecha_registro);
            res.json(usuarioDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
        }
    }

    async eliminarUsuario(req, res) {
        try {
            const id = req.params.id;
            const usuarioEliminado = await UsuarioDAO.eliminar(id);
            if (!usuarioEliminado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
        }
    }
}

module.exports = new UsuarioController();