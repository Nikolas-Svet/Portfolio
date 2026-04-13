import type { App } from "vue";
import { ApiError, NetworkError, ValidationError } from "../api/http/errors";
import { pushToast } from "./toasts";

function formatError(err: unknown) {
  if (err instanceof ValidationError) return "Ошибка валидации данных";
  if (err instanceof NetworkError) return "Ошибка сети";
  if (err instanceof ApiError) return err.message || "Ошибка API";
  if (err instanceof Error) return err.message || "Неизвестная ошибка";
  return "Неизвестная ошибка";
}

export function installGlobalErrorHandler(app: App) {
  app.config.errorHandler = (err) => {
    pushToast(formatError(err), "error");
  };

  window.addEventListener("unhandledrejection", (event) => {
    pushToast(formatError(event.reason), "error");
  });

  window.addEventListener("error", (event) => {
    pushToast(formatError(event.error ?? event.message), "error");
  });
}
