import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// window.axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;
window.axios.defaults.url = import.meta.env.VITE_APP_BASE_URL;
