module.exports = {
    send_success(message, data = null) {
        return {
            'estado': 1,
            'mensaje': message,
            'datos': data
        };
    },
    send_warning(message) {
        return {
            'estado': 0,
            'mensaje': message,
        };
    },
    send_error() {
        return {
            'estado': 0,
            'mensaje': 'Ocurrió un error interno en el servidor',
        };
    },
}