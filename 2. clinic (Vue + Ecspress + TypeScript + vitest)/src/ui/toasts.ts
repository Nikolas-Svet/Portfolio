import { reactive } from "vue";

export type ToastType = "error" | "info" | "success";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

const state = reactive<{ toasts: Toast[] }>({
  toasts: []
});

let nextId = 1;

export function pushToast(message: string, type: ToastType = "error", ttlMs = 4000) {
  const id = nextId++;
  state.toasts.push({ id, message, type });
  window.setTimeout(() => removeToast(id), ttlMs);
}

export function removeToast(id: number) {
  const idx = state.toasts.findIndex((t) => t.id === id);
  if (idx >= 0) state.toasts.splice(idx, 1);
}

export function useToasts() {
  return state;
}
