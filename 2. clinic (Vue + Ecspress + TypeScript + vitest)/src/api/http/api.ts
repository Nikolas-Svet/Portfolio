import { NetworkError } from './errors'
import { handleHttpStatus } from './statusHandler'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const API_PREFIX = '/api'

export interface RequestOptions {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
}

export function authHeaders(headers: Record<string, string> = {}) {
  const token = localStorage.getItem('authToken')
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function buildQuery(q?: RequestOptions['query']) {
  if (!q) return ''
  const entries = Object.entries(q)
    .filter(([, v]) => v != null)
    .map(([k, v]) => [k, String(v!)])
  return entries.length
    ? `?${new URLSearchParams(entries as unknown as Record<string, string>)}`
    : ''
}

function prepareBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) return undefined
  if (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams
  ) {
    return body as BodyInit
  }
  return JSON.stringify(body)
}

export async function request(opts: RequestOptions): Promise<Response> {
  const { url, method = 'GET', headers, body, query } = opts

  const finalHeaders: Record<string, string> = { ...(headers || {}) }
  const finalBody = prepareBody(body)
  const fullUrl = `${url}${buildQuery(query)}`

  try {
    const resp = await fetch(fullUrl, { method, headers: finalHeaders, body: finalBody })
    handleHttpStatus(resp)
    return resp
  } catch (e: unknown) {
    throw new NetworkError(errorMessage(e))
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'object' && e !== null && 'message' in e) {
    const m = (e as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return 'Network request failed'
}

type FlagState = { auth?: boolean; json?: boolean }

function applyFlags(opts: RequestOptions, flags: FlagState): RequestOptions {
  let headers = { ...(opts.headers || {}) }

  if (flags.auth) headers = authHeaders(headers)
  if (flags.json) {
    headers.Accept ??= 'application/json'
    if (opts.body !== undefined && headers['Content-Type'] == null) {
      headers['Content-Type'] = 'application/json'
    }
  }
  return { ...opts, headers }
}

type ApiCore = {
  get: (url: string, opts?: Omit<RequestOptions, 'url' | 'method' | 'body'>) => Promise<Response>
  delete: (url: string, opts?: Omit<RequestOptions, 'url' | 'method' | 'body'>) => Promise<Response>
  post: (
    url: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'url' | 'method'>
  ) => Promise<Response>
  put: (
    url: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'url' | 'method'>
  ) => Promise<Response>
  patch: (
    url: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'url' | 'method'>
  ) => Promise<Response>
}

type ApiFluent = ApiCore & {
  auth: ApiFluent
  json: ApiFluent
}

function makeApi(flags: FlagState = {}): ApiFluent {
  const core: ApiCore = {
    get: (url, opts = {}) => request(applyFlags({ url, method: 'GET', ...opts }, flags)),
    delete: (url, opts = {}) => request(applyFlags({ url, method: 'DELETE', ...opts }, flags)),
    post: (url, body, opts = {}) =>
      request(applyFlags({ url, method: 'POST', body, ...opts }, flags)),
    put: (url, body, opts = {}) =>
      request(applyFlags({ url, method: 'PUT', body, ...opts }, flags)),
    patch: (url, body, opts = {}) =>
      request(applyFlags({ url, method: 'PATCH', body, ...opts }, flags))
  }

  const fluent = core as unknown as ApiFluent

  const handler: ProxyHandler<ApiFluent> = {
    get(target, prop, receiver) {
      if (prop === 'auth') return makeApi({ ...flags, auth: true })
      if (prop === 'json') return makeApi({ ...flags, json: true })
      return Reflect.get(target, prop, receiver) as ApiFluent[Extract<typeof prop, keyof ApiFluent>]
    }
  }

  return new Proxy(fluent, handler)
}

export const api = makeApi()
