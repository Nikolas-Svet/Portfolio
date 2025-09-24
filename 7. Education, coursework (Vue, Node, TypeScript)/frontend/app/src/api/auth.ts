import { request } from './request'
import { API_PREFIX } from '@/utils/consts.ts'

export const authApi = {
  async SignUp(firstName: string, lastName: string, username: string, password: string, role: string) {
    try {
      const response = await request.post(`${API_PREFIX}auth/register/`, {
        firstName,
        lastName,
        username,
        password,
        role,
      })

      if (response.status === 201) {
        console.log('Registration successful', response.data)
        return { success: true }
      }

      return { success: false, error: response.data }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return { success: false, error: error.response.data }
      }
      return { success: false, error: 'Не удалось зарегистрироваться' }
    }
  },

  async SignIn(username: string, password: string) {
    try {
      const response = await request.post(`${API_PREFIX}auth/login/`, { username, password })

      const { token } = response.data

      if (token && response.status === 200) {
        localStorage.setItem('token', token)
        return { success: true }
      }

      return { success: false, error: response.data }
    } catch (error: any) {
      if (error.response.status === 401) {
        return { success: false, error: error.response.data }
      }
      if (error.response && error.response.data && error.response.data.detail) {
        return { success: false, error: error.response.data.detail }
      }
      return { success: false, error: 'Login failed. Please check your credentials.' }
    }
  },
}
