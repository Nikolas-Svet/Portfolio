import { request } from './request';
import { API_PREFIX } from '@/utils/consts.ts';

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface TeacherShort {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'student' | 'teacher';
  photo?: string | null;
}

export const userApi = {
  /** Получить список преподавателей */
  async getTeachers(): Promise<ApiResult<TeacherShort[]>> {
    try {
      const { status, data } = await request.get<TeacherShort[]>(`${API_PREFIX}user/teachers`);
      if (status === 200) return { success: true, data };
      return { success: false, error: data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error };
    }
  },

  /** Получить собственный профиль */
  async getProfile(): Promise<ApiResult<UserProfile>> {
    try {
      const { status, data } = await request.get<UserProfile>(`${API_PREFIX}user/me`);
      if (status === 200) return { success: true, data };
      return { success: false, error: data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error };
    }
  },

  /** Удалить пользователя */
  async deleteUser(id: string): Promise<ApiResult<{ message: string }>> {
    try {
      const { status, data } = await request.delete<{ message: string }>(`${API_PREFIX}user/${id}`);
      if (status === 200) return { success: true, data };
      return { success: false, error: data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error };
    }
  },

  /** Обновить фото профиля */
  async updatePhoto(file: File): Promise<ApiResult<UserProfile>> {
    try {
      const form = new FormData();
      form.append('photo', file);
      const { status, data } = await request.put<UserProfile>(
        `${API_PREFIX}user/me/photo`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (status === 200) return { success: true, data };
      return { success: false, error: data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error };
    }
  }
};

