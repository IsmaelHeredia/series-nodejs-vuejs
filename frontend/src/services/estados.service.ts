import axios from "axios";

const backend_url = import.meta.env.VITE_API_URL;
const session_name = import.meta.env.VITE_SESSION_NAME;
const token = sessionStorage.getItem(session_name);

var config = {};

if (token != "") {
    config = {
        headers: { Authorization: `Bearer ${token}` }
    };
}

class EstadoDataService {

    listar() {
        return axios.get(backend_url + "/estados", config);
    };

}

export default new EstadoDataService();