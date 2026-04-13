import axios from 'axios'

export const request = axios.create({
    // baseURL: VITE_API_URL,
    timeout: 30_000,
    withCredentials: true,
})

export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
        return null
    }

    const m = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\\]\/+^])/g, '\\$1') + '=([^;]*)')
    )
    return m ? decodeURIComponent(m[1]) : null
}

request.interceptors.request.use(
    (config) => {
        const token = getCookie('csrftoken')
        if (token) {
            config.headers = config.headers ?? {}
            ;(config.headers as Record<string, string>)['X-CSRFToken'] = token
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
