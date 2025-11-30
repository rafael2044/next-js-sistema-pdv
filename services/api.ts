import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // Pegamos o ID do terminal salvo
        const terminalId = localStorage.getItem('terminal_id');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Injetamos o Header, se existir
        if (terminalId) {
            config.headers['x-terminal-id'] = terminalId;
        }
    }
    return config;
});
export default api;