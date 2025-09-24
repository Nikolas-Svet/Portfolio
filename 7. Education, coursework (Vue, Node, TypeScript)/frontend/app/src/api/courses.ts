import { request } from './request'
import { API_PREFIX } from '@/utils/consts.ts'
import type { CoursePayload } from '@/types/courses.ts'

export const coursesApi = {
  async getCourseById(id: string) {
    const response = await request.get(`${API_PREFIX}courses/${id}`)
    return response.status === 200
      ? { success: true, data: response.data }
      : { success: false, error: response.data }
  },

  async deleteCourse(id: string) {
    const response = await request.delete(`${API_PREFIX}courses/${id}`)
    return response.status === 200
      ? { success: true }
      : { success: false, error: response.data }
  },

  async createCourse(payload: CoursePayload) {
    const form = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) form.append(key, value as any)
    })

    const response = await request.post(`${API_PREFIX}courses/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.status === 201
      ? { success: true, data: response.data }
      : { success: false, error: response.data }
  },

  async updateCourse(id: string, payload: Partial<CoursePayload>) {
    const form = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) form.append(key, value as any)
    })

    const response = await request.put(`${API_PREFIX}courses/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.status === 200
      ? { success: true, data: response.data }
      : { success: false, error: response.data }
  },
  async getCategories() {
    try {
      const response = await request.get(`${API_PREFIX}courses/categories/`)

      if (response.status === 200) {
        return { success: true, data: response.data }
      }

      return { success: false, error: response.data }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return { success: false, error: error.response.data }
      }
      return { success: false, error: 'Не удалось зарегистрироваться' }
    }
  },
  async getCourses(params: Record<string, any>) {
    try {
      const response = await request.get(`${API_PREFIX}courses`, { params })

      if (response.status === 200) {
        return { success: true, data: response.data }
      }

      return { success: false, error: response.data }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return { success: false, error: error.response.data }
      }
      return { success: false, error: 'Не удалось получить курсы' }
    }
  },
  async getCoursesMy() {
    try {
      const response = await request.get(`${API_PREFIX}courses/my`)

      if (response.status === 200) {
        return { success: true, data: response.data }
      }

      return { success: false, error: response.data }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return { success: false, error: error.response.data }
      }
      return { success: false, error: 'Не удалось получить курсы' }
    }
  },
}
