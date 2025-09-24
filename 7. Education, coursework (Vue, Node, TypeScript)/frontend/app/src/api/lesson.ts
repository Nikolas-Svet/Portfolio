// src/api/lessons.ts
import { request } from './request'
import { API_PREFIX } from '@/utils/consts'
import type { ILesson } from '@/types/lesson'

export interface LessonPayload {
  title: string
  content?: string
  videoUrl?: string
  course: string
  order?: number
}

export const lessonsApi = {
  async getLessons() {
    try {
      const response = await request.get(`${API_PREFIX}lessons`)
      if (response.status === 200) {
        return { success: true, data: response.data as ILesson[] }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Не удалось получить уроки',
      }
    }
  },

  async getLessonById(id: string) {
    try {
      const response = await request.get(`${API_PREFIX}lessons/${id}`)
      if (response.status === 200) {
        return { success: true, data: response.data as ILesson }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Не удалось получить урок',
      }
    }
  },

  async createLesson(payload: LessonPayload) {
    try {
      const response = await request.post(
        `${API_PREFIX}lessons`,
        payload
      )
      if (response.status === 201) {
        return { success: true, data: response.data as ILesson }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Не удалось создать урок',
      }
    }
  },

  async updateLesson(
    id: string,
    payload: Partial<LessonPayload>
  ) {
    try {
      const response = await request.put(
        `${API_PREFIX}lessons/${id}`,
        payload
      )
      if (response.status === 200) {
        return { success: true, data: response.data as ILesson }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Не удалось обновить урок',
      }
    }
  },

  async deleteLesson(id: string) {
    try {
      const response = await request.delete(
        `${API_PREFIX}lessons/${id}`
      )
      if (response.status === 200) {
        return { success: true }
      }
      return { success: false, error: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Не удалось удалить урок',
      }
    }
  },
}
