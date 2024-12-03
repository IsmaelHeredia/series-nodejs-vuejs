import axios from "axios";

interface FormGenero {
    nombre: string;
}

const backend_url = import.meta.env.VITE_API_URL;
const session_name = import.meta.env.VITE_SESSION_NAME;
const token = sessionStorage.getItem(session_name);

var config = {};

if (token != "") {
    config = {
        headers: { Authorization: `Bearer ${token}` }
    };
}

class GeneroDataService {

    listar() {
        return axios.get(backend_url + "/generos", config);
    };

    filtrar(nombre: string, pagina: number) {

        const parametros = {
            "nombre": nombre,
            "pagina": pagina
        };

        return axios.post(backend_url + "/generos/filtrar", parametros, config);
    };

    cargar(id: number) {
        return axios.get(backend_url + "/generos/" + id, config);
    };

    crear(datos: FormGenero) {

        const parametros = {
            "nombre": datos.nombre
        }

        return axios.post(backend_url + "/generos", parametros, config);
    };

    editar(id: number, datos: FormGenero) {

        const parametros = {
            "nombre": datos.nombre
        }

        return axios.put(backend_url + "/generos/" + id, parametros, config);
    };

    borrar(id: number) {
        return axios.delete(backend_url + "/generos/" + id, config);
    };

}

export default new GeneroDataService();