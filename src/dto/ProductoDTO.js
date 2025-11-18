class ProductoDTO {
    constructor(id, id_categoria, nombre, descripcion, precio, stock, fecha_creacion, imagenes = []) {
        this.id_producto = id;
        this.id_categoria = id_categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.fecha_creacion = fecha_creacion;
        this.imagenes = imagenes; // Array de objetos de imagen
    }
}

module.exports = ProductoDTO;
