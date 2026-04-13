import type { Response } from "express";

export type JsonErrorResponse = {
  error: string;
  details?: unknown;
};

export function createErrorResponse(message: string, details?: unknown): JsonErrorResponse {
  if (details === undefined) {
    return { error: message };
  }

  return { error: message, details };
}

export function sendError(
  response: Response,
  status: number,
  message: string,
  details?: unknown
) {
  return response.status(status).json(createErrorResponse(message, details));
}

export function parsePositiveInt(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
