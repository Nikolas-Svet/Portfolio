import { defineStore } from 'pinia';
import type {AuthState, UserPayload} from "@/types/auth";

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUser(user: UserPayload) {
      this.user = user;
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    }
  },
});
