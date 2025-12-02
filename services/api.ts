import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {

    const token = Cookies.get('token');
    // Pegamos o ID do terminal salvo
    const terminalId = Cookies.get('terminal_id');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Injetamos o Header, se existir
    if (terminalId) {
        config.headers['x-terminal-id'] = terminalId;
    }

    return config;
});
export default api;