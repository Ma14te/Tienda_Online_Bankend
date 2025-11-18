const ProductoDAO = require('../dao/ProductoDAO');
const ProductoDTO = require('../dto/ProductoDTO');

class ProductoController {

    async crearProducto(req, res) {
        try {
            const { id_categoria, nombre, descripcion, precio, stock } = req.body;
            if (!nombre || !precio) {
                return res.status(400).json({ mensaje: 'Nombre y precio son requeridos' });
            }
            const nuevoProducto = await ProductoDAO.crear(id_categoria, nombre, descripcion, precio, stock);
            // El DTO se crea sin imágenes al principio
            const productoDTO = new ProductoDTO(nuevoProducto.id_producto, nuevoProducto.id_categoria, nuevoProducto.nombre, nuevoProducto.descripcion, nuevoProducto.precio, nuevoProducto.stock, nuevoProducto.fecha_creacion, []);
            res.status(201).json(productoDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
        }
    }

    async obtenerProductos(req, res) {
        try {
            const productos = await ProductoDAO.obtenerTodos();
            const productosDTO = productos.map(p => new ProductoDTO(p.id_producto, p.id_categoria, p.nombre, p.descripcion, p.precio, p.stock, p.fecha_creacion, p.imagenes));
            res.json(productosDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
        }
    }

    async obtenerProductoPorId(req, res) {
        try {
            const id = req.params.id;
            const producto = await ProductoDAO.obtenerPorId(id);
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            const productoDTO = new ProductoDTO(producto.id_producto, producto.id_categoria, producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.fecha_creacion, producto.imagenes);
            res.json(productoDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
        }
    }

    async actualizarProducto(req, res) {
        try {
            const id = req.params.id;
            const { id_categoria, nombre, descripcion, precio, stock } = req.body;
            if (!nombre || !precio) {
                return res.status(400).json({ mensaje: 'Nombre y precio son requeridos' });
            }
            const productoActualizado = await ProductoDAO.actualizar(id, id_categoria, nombre, descripcion, precio, stock);
            if (!productoActualizado) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            // Obtenemos el producto de nuevo para tener las imágenes actualizadas
            const productoConImagenes = await ProductoDAO.obtenerPorId(id);
            const productoDTO = new ProductoDTO(productoConImagenes.id_producto, productoConImagenes.id_categoria, productoConImagenes.nombre, productoConImagenes.descripcion, productoConImagenes.precio, productoConImagenes.stock, productoConImagenes.fecha_creacion, productoConImagenes.imagenes);
            res.json(productoDTO);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
        }
    }

    async eliminarProducto(req, res) {
        try {
            const id = req.params.id;
            const productoEliminado = await ProductoDAO.eliminar(id);
            if (!productoEliminado) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
        }
    }
}

module.exports = new ProductoController();
