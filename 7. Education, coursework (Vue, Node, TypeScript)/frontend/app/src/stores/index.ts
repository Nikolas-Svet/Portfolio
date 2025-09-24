// src/stores/index.ts
import { createPinia } from 'pinia';
import type { App } from 'vue';

import { useAuthStore } from './auth';
// В будущем: import { useCourseStore } from './course';

export const pinia = createPinia();

export function setupStores(app: App) {
  app.use(pinia);
}

export function createStores() {
  return {
    auth: useAuthStore(pinia),
    // course: useCourseStore(pinia),
    // user: useUserStore(pinia),
  };
}

export * from './auth';
