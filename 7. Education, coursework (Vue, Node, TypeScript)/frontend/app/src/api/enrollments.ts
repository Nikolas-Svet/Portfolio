// src/api/enrollments.ts
import { request } from './request'
import { API_PREFIX } from '@/utils/consts'
import type { IEnrollment } from '@/types/enrollment'

export interface EnrollmentPayload {
  courseId: string
}

export const enrollmentsApi = {
  async enroll(courseId: string) {
    try {
      const response = await request.post(
        `${API_PREFIX}enrollments/`,
        { courseId }
      )
      if (response.status === 201) {
        return { success: true, data: response.data as IEnrollment }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось записаться на курс' }
    }
  },

  async getEnrollments() {
    console.log("getEnrollments")
    try {
      const response = await request.get(
        `${API_PREFIX}enrollments`
      )
      if (response.status === 200) {
        return { success: true, data: response.data as IEnrollment[] }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось получить записи' }
    }
  },

  async getEnrollmentById(id: string) {
    try {
      const response = await request.get(`${API_PREFIX}enrollments/${id}`)
      if (response.status === 200) {
        return { success: true, data: response.data as IEnrollment }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось получить запись' }
    }
  },

  async completeLesson(id: string, lessonId: string) {
    try {
      const response = await request.patch(
        `${API_PREFIX}enrollments/${id}/complete/${lessonId}`
      )
      if (response.status === 200) {
        return { success: true, data: response.data as IEnrollment }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось отметить урок' }
    }
  },

  async cancelLesson(id: string, lessonId: string) {
    try {
      const response = await request.patch(
        `${API_PREFIX}enrollments/${id}/cancel/${lessonId}`
      )
      if (response.status === 200) {
        return { success: true, data: response.data as IEnrollment }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось отменить урок' }
    }
  },

  async deleteEnrollment(id: string) {
    try {
      const response = await request.delete(`${API_PREFIX}enrollments/${id}`)
      if (response.status === 200) {
        return { success: true }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось отписаться' }
    }
  },

  async countStudents(courseId: string) {
    try {
      const response = await request.get(
        `${API_PREFIX}enrollments/course/${courseId}/count`
      )
      if (response.status === 200) {
        return { success: true, count: response.data.count as number }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return { success: false, error: error.response?.data || 'Не удалось получить количество студентов' }
    }
  },
}
