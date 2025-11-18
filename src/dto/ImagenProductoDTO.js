class ImagenProductoDTO {
    constructor(id, id_producto, url_imagen, es_principal) {
        this.id_imagen = id;
        this.id_producto = id_producto;
        this.url_imagen = url_imagen;
        this.es_principal = es_principal;
    }
}

module.exports = ImagenProductoDTO;
