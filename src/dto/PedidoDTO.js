class PedidoDTO {
    constructor(id, id_usuario, fecha_pedido, total, items) {
        this.id_pedido = id;
        this.id_usuario = id_usuario;
        this.fecha_pedido = fecha_pedido;
        this.total = total;
        this.items = items; // Array de PedidoItemDTO
    }
}

class PedidoItemDTO {
    constructor(id_item_pedido, id_producto, cantidad, precio_unitario) {
        this.id_item_pedido = id_item_pedido;
        this.id_producto = id_producto;
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
    }
}

module.exports = { PedidoDTO, PedidoItemDTO };
