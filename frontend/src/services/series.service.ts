import axios from "axios";

interface FormSerie {
    nombre: string;
    links: string;
    ultima_temporada: number;
    ultimo_capitulo: number;
    calificacion: number;
    estado_id: number;
    generos: any;
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

const config_upload = {
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
    }
};

class SerieDataService {

    listar(cantidad: number, pagina: number, nombre: string, generos: any, estado: number) {

        const parametros = {
            "cantidad": cantidad,
            "pagina": pagina,
            "nombre": nombre,
            "generos": generos,
            "estado": estado
        };

        return axios.post(backend_url + "/series/filtrar", parametros, config);
    };

    cargar(id: number) {
        return axios.get(backend_url + "/series/" + id, config);
    };

    crear(datos: FormSerie) {

        const parametros = {
            "nombre": datos.nombre,
            "links": datos.links,
            "ultima_temporada": datos.ultima_temporada,
            "ultimo_capitulo": datos.ultimo_capitulo,
            "calificacion": datos.calificacion,
            "estado_id": datos.estado_id,
            "generos": datos.generos
        };

        return axios.post(backend_url + "/series", parametros, config);
    };

    editar(id: number, datos: FormSerie) {

        const parametros = {
            "nombre": datos.nombre,
            "links": datos.links,
            "ultima_temporada": datos.ultima_temporada,
            "ultimo_capitulo": datos.ultimo_capitulo,
            "calificacion": datos.calificacion,
            "estado_id": datos.estado_id,
            "generos": datos.generos
        };

        return axios.put(backend_url + "/series/" + id, parametros, config);
    };

    borrar(id: number) {
        return axios.delete(backend_url + "/series/" + id, config);
    };

    subirImagen(id: number, imagen: File) {

        const formData = new FormData();
        formData.append("imagen", imagen);

        return axios.post(backend_url + "/series/" + id + "/subirImagen", formData, config_upload);
    }

}

export default new SerieDataService();