const ImagenProductoDAO = require('../dao/ImagenProductoDAO');
const ImagenProductoDTO = require('../dto/ImagenProductoDTO');

class ImagenProductoController {

    async agregarImagen(req, res) {
        try {
            const { id_producto, url_imagen, es_principal } = req.body;
            if (!id_producto || !url_imagen) {
                return res.status(400).json({ mensaje: 'id_producto y url_imagen son requeridos' });
            }
            const nuevaImagen = await ImagenProductoDAO.agregar(id_producto, url_imagen, es_principal);
            const imagenDTO = new ImagenProductoDTO(nuevaImagen.id_imagen, nuevaImagen.id_producto, nuevaImagen.url_imagen, nuevaImagen.es_principal);
            res.status(201).json(imagenDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al agregar imagen', error: error.message });
        }
    }

    async obtenerImagenesPorProducto(req, res) {
        try {
            const id_producto = req.params.id_producto;
            const imagenes = await ImagenProductoDAO.obtenerPorProducto(id_producto);
            const imagenesDTO = imagenes.map(img => new ImagenProductoDTO(img.id_imagen, img.id_producto, img.url_imagen, img.es_principal));
            res.json(imagenesDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener imágenes', error: error.message });
        }
    }

    async eliminarImagen(req, res) {
        try {
            const id_imagen = req.params.id;
            const imagenEliminada = await ImagenProductoDAO.eliminar(id_imagen);
            if (!imagenEliminada) {
                return res.status(404).json({ mensaje: 'Imagen no encontrada' });
            }
            res.json({ mensaje: 'Imagen eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar imagen', error: error.message });
        }
    }

    async actualizarImagen(req, res) {
        try {
            const id_imagen = req.params.id;
            const { url_imagen, es_principal } = req.body;
            if (typeof url_imagen === 'undefined' && typeof es_principal === 'undefined') {
                return res.status(400).json({ mensaje: 'Debe enviar al menos un campo para actualizar (url_imagen o es_principal)' });
            }
            const actualizada = await ImagenProductoDAO.actualizar(id_imagen, { url_imagen, es_principal });
            if (!actualizada) return res.status(404).json({ mensaje: 'Imagen no encontrada' });
            const dto = new ImagenProductoDTO(actualizada.id_imagen, actualizada.id_producto, actualizada.url_imagen, actualizada.es_principal);
            res.json(dto);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar imagen', error: error.message });
        }
    }
}

module.exports = new ImagenProductoController();
