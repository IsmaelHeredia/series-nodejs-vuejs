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
const session_name = import.meta.env.VITE_SESSION_NAME;
const token = sessionStorage.getItem(session_name);

var config = {};

if (token != null && token != "") {
    config = {
        headers: { Authorization: `Bearer ${token}` }
    };
}

class UsuarioDataService {

    ingresar(datos: FormIngreso) {

        const parametros = {
            "usuario": datos.nombre,
            "clave": datos.clave
        };

        return axios
            .post(backend_url + "/ingreso", parametros);
    };

    async validar(datos: FormValidar) {

        const parametros = {
            "token": datos.token
        }

        return axios.post(backend_url + "/validar", parametros).then(response => response).catch(err => console.log("error", err))
    };

    actualizarCuenta(datos: FormCuenta) {

        const parametros = {
            "usuario": datos.usuario,
            "nuevo_usuario": datos.nuevo_usuario,
            "clave": datos.clave,
            "nueva_clave": datos.nueva_clave
        };

        return axios
            .post(backend_url + "/cuenta", parametros, config);
    };

}

export default new UsuarioDataService();