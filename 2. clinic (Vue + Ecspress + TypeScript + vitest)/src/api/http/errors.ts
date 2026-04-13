export class ApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly payload?: unknown
  constructor(message: string, status: number, statusText: string, payload?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.payload = payload
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, payload?: unknown) {
    super(message || 'Validation failed', 422, 'Unprocessable Entity', payload)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}
