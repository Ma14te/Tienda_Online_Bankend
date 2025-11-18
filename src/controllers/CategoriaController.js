const CategoriaDAO = require('../dao/CategoriaDAO');
const CategoriaDTO = require('../dto/CategoriaDTO');

class CategoriaController {

    async crearCategoria(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                return res.status(400).json({ mensaje: 'El nombre es requerido' });
            }
            const nuevaCategoria = await CategoriaDAO.crear(nombre, descripcion);
            const categoriaDTO = new CategoriaDTO(nuevaCategoria.id_categoria, nuevaCategoria.nombre, nuevaCategoria.descripcion);
            res.status(201).json(categoriaDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear categoría', error: error.message });
        }
    }

    async obtenerCategorias(req, res) {
        try {
            const categorias = await CategoriaDAO.obtenerTodas();
            const categoriasDTO = categorias.map(c => new CategoriaDTO(c.id_categoria, c.nombre, c.descripcion));
            res.json(categoriasDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
        }
    }

    async obtenerCategoriaPorId(req, res) {
        try {
            const id = req.params.id;
            const categoria = await CategoriaDAO.obtenerPorId(id);
            if (!categoria) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada' });
            }
            const categoriaDTO = new CategoriaDTO(categoria.id_categoria, categoria.nombre, categoria.descripcion);
            res.json(categoriaDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener categoría', error: error.message });
        }
    }

    async actualizarCategoria(req, res) {
        try {
            const id = req.params.id;
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                return res.status(400).json({ mensaje: 'El nombre es requerido' });
            }
            const categoriaActualizada = await CategoriaDAO.actualizar(id, nombre, descripcion);
            if (!categoriaActualizada) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada' });
            }
            const categoriaDTO = new CategoriaDTO(categoriaActualizada.id_categoria, categoriaActualizada.nombre, categoriaActualizada.descripcion);
            res.json(categoriaDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
        }
    }

    async eliminarCategoria(req, res) {
        try {
            const id = req.params.id;
            const categoriaEliminada = await CategoriaDAO.eliminar(id);
            if (!categoriaEliminada) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada' });
            }
            res.json({ mensaje: 'Categoría eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
        }
    }
}

module.exports = new CategoriaController();
