import axios from "axios";

interface FormIngreso {
    nombre: string;
    clave: string;
}

interface FormValidar {
    token: string | null;
}

interface FormCuenta {
    usuario: string;
    nuevo_usuario: string;
    clave: string;
    nueva_clave: string;
}

const backend_url = import.meta.env.VITE_API_URL;

class UsuarioDataService {

    ingresar(datos: FormIngreso) {

        const parametros = {
            "usuario": datos.nombre,
            "clave": datos.clave
        };

        return axios
            .post(backend_url + "/ingreso", parametros);
    };

    validar(datos: FormValidar) {

        const parametros = {
            "token": datos.token
        }

        return axios
            .post(backend_url + "/validar", parametros);
    };

    actualizarCuenta(datos: FormCuenta) {

        const parametros = {
            "usuario": datos.usuario,
            "nuevo_usuario": datos.nuevo_usuario,
            "clave": datos.clave,
            "nueva_clave": datos.nueva_clave
        };

        return axios
            .post(backend_url + "/cuenta", parametros);
    };

}

export default new UsuarioDataService();