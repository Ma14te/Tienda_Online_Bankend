class UsuarioDTO {
    constructor(id, nombre, email, fecha_registro, es_admin = false) {
        this.id_usuario = id;
        this.nombre = nombre;
        this.email = email;
        this.es_admin = es_admin;
        this.fecha_registro = fecha_registro;
    }
}

module.exports = UsuarioDTO;
