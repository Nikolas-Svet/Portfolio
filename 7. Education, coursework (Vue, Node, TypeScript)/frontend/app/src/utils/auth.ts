import { useAuthStore } from '@/stores/auth';
import type { JWTPayload } from '@/types/auth';

export function initAuth(authStore: any): void {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const base64Payload = token.split('.')[1];
    const payloadJson = atob(
      base64Payload.replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadJson) as JWTPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Осталось токену жить в секундах: ", payload.exp - currentTime);
    if (payload.exp < currentTime) {
      console.warn('JWT token has expired');
      localStorage.removeItem('token');
      return;
    }

    authStore.setToken(token);
    authStore.setUser({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
  } catch (e) {
    console.error('Failed to parse JWT', e);
    localStorage.removeItem('token');
  }
}
