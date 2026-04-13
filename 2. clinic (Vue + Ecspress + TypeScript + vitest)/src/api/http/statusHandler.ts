import { ApiError, ValidationError } from './errors'
export function handleHttpStatus(resp: Response): void {
  if (resp.ok) return

  if (resp.status === 422) {
    console.warn('Validation error', resp)
    const msg = 'Ошибка валидации данных'
    throw new ValidationError(msg, resp)
  }

  const msg = `${resp.status} ${resp.statusText || 'Unknown Error'}`

  console.error(msg, resp)

  throw new ApiError(msg, resp.status, resp.statusText, resp)
}
