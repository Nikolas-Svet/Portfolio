import { apiGet } from "./client";

export type Health = { status: string };

export function getHealth() {
  return apiGet<Health>("/api/health");
}
