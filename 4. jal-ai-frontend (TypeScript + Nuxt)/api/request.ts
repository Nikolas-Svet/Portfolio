import axios from 'axios'

const { VITE_API_URL } = import.meta.env

export const request = axios.create({
    // baseURL: VITE_API_URL,
    timeout: 30_000,
    withCredentials: true,
})

export function getCookie(name: string): string | null {
    const m = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    )
    return m ? decodeURIComponent(m[1]) : null
}

request.interceptors.request.use(
    (config) => {
        console.log(
            `%c[Log][API Request] %c${config.method?.toUpperCase()} %c${config.url}`,
            'color: #888',
            'color: #4caf50; font-weight: bold;',
            'color: #2196f3;'
        )
        const token = getCookie('csrftoken')
        if (token) {
            // @ts-ignore
            config.headers['X-CSRFToken'] = token
        }
        return config
    },
    (error) => Promise.reject(error)
)

request.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Превышено время ожидания', true)
        }
        return Promise.reject(error)
    }
)
