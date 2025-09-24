import axios from 'axios'

const { VITE_API_URL } = import.meta.env

export const request = axios.create({
  baseURL: VITE_API_URL
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    config.headers['Authorization'] = 'Bearer ' + token
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
