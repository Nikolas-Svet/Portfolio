import axios from "axios";

const { VITE_API_URL } = import.meta.env;

export const request = axios.create({
    baseURL: VITE_API_URL
});

request.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${VITE_API_URL}/auth/refresh/`, { refresh: refreshToken });
                    localStorage.setItem('access_token', data.access);
                    originalRequest.headers["Authorization"] = "Bearer " + data.access;
                    return request(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token invalid, logging out...");
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = "/sign-in";
                }
            }
        }
        return Promise.reject(error);
    }
);
